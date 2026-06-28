import axios from "axios";
import api from "./api";

// In dev, VITE_ML_SERVICE_URL is set → call the local ML service directly.
// In production, it's unset → route through the Spring Boot proxy on Render
// (which requires ML_SERVICE_BASE_URL to be configured in the Render dashboard).
const ML_DIRECT_URL = import.meta.env.VITE_ML_SERVICE_URL;

const mlAxios = ML_DIRECT_URL
    ? axios.create({
        baseURL: ML_DIRECT_URL,
        timeout: 15000,
        headers: { "Content-Type": "application/json" },
    })
    : null;

export async function runMlPrediction(modelType, inputData) {
    if (mlAxios) {
        const response = await mlAxios.post("/api/ml/predict", { modelType, inputData });
        return response.data;
    }
    const response = await api.post("api/ml/predict", { modelType, inputData });
    return response.data;
}
