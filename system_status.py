import pandas as pd
import numpy as np
import joblib
import shap

# -------- Load sensor fault detection models --------
sensor_model = joblib.load("models/sensor_fault_model_v2.pkl")
sensor_feature_columns = joblib.load("models/sensor_feature_columns_v2.pkl")
sensor_target_columns = joblib.load("models/sensor_target_columns_v2.pkl")
sensor_explainers = [shap.TreeExplainer(est) for est in sensor_model.estimators_]

# -------- Load row anomaly detection models --------
row_model = joblib.load("models/row_anomaly_model.pkl")
row_scaler = joblib.load("models/row_anomaly_scaler.pkl")
row_feature_columns = joblib.load("models/row_feature_columns.pkl")
row_feature_medians = joblib.load("models/row_feature_medians.pkl")

# -------- SHAP helper --------
def _extract_shap_row(values, n_feat):
    if isinstance(values, list):
        return np.asarray(values[1])[0]
    values = np.asarray(values)
    if values.ndim == 1 and values.shape[0] == n_feat:
        return values
    if values.ndim == 2:
        r, c = values.shape
        if r == 1 and c == n_feat:
            return values[0]
        if r >= 1 and c == n_feat:
            return values[0]
        if r == n_feat and c == 2:
            return values[:, 1]
        if r == 2 and c == n_feat:
            return values[1]
    if values.ndim == 3:
        a, b, c = values.shape
        if a == 1 and c == 2:
            return values[0, :, 1]
        if a >= 1 and b == n_feat and c == 2:
            return values[0, :, 1]
        if a == 2 and b == 1 and c == n_feat:
            return values[1, 0, :]
    raise ValueError(f"Unsupported SHAP shape: {values.shape}")

# -------- Combined system prediction --------
def predict_system_status(input_json: dict, top_n: int = 3):
    """
    Runs both the sensor fault model and the row anomaly model.

    Returns:
        dict with keys:
            - sensor_faults
            - sensor_explanations
            - row_anomaly
            - row_score
            - row_top_features
    """
    ### ========== Sensor-Wise Fault Detection ==========
    sensor_df = pd.DataFrame([input_json])
    sensor_df = pd.get_dummies(sensor_df)
    for col in sensor_feature_columns:
        if col not in sensor_df:
            sensor_df[col] = -999
    sensor_df = sensor_df[sensor_feature_columns]

    pred = sensor_model.predict(sensor_df)
    pred_df = pd.DataFrame(pred, columns=sensor_target_columns)

    # Fallback for missing input values
    for sensor in sensor_target_columns:
        if sensor in input_json and pd.isna(input_json[sensor]):
            pred_df.loc[0, sensor] = 1

    faulty_sensors = pred_df.columns[pred_df.iloc[0] == 1].tolist()

    # SHAP-based explanation
    sensor_explanations = {}
    for i, sensor in enumerate(sensor_target_columns):
        if sensor in faulty_sensors:
            raw_shap = sensor_explainers[i].shap_values(sensor_df)
            shap_row = _extract_shap_row(raw_shap, len(sensor_feature_columns))
            top_feats = (
                pd.Series(shap_row, index=sensor_feature_columns)
                .abs()
                .sort_values(ascending=False)
                .head(top_n)
                .to_dict()
            )
            sensor_explanations[sensor] = top_feats

    ### ========== Row-Level Anomaly Detection ==========
    row_df = pd.DataFrame([input_json])
    row_df = pd.get_dummies(row_df)
    for col in row_feature_columns:
        if col not in row_df:
            row_df[col] = -999
    row_df = row_df[row_feature_columns]

    X_scaled = row_scaler.transform(row_df)
    base_score = float(row_model.decision_function(X_scaled)[0])
    anomaly_flag = int(row_model.predict(X_scaled)[0])

    influences = {}
    row_orig = row_df.iloc[0].copy()
    for feat in row_feature_columns:
        row_mod = row_orig.copy()
        row_mod[feat] = row_feature_medians.get(feat, row_mod[feat])
        mod_scaled = row_scaler.transform([row_mod])
        new_score = float(row_model.decision_function(mod_scaled)[0])
        influences[feat] = abs(base_score - new_score)

    top_row_features = dict(
        sorted(influences.items(), key=lambda x: -x[1])[:top_n]
    )

    ### ========== Return All Results ==========
    return {
        "sensor_faults": faulty_sensors,
        "sensor_explanations": sensor_explanations,
        "row_anomaly": anomaly_flag,
        "row_score": base_score,
        "row_top_features": top_row_features
    }
