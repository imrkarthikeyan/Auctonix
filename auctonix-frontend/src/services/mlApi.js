import api from "./api";

export async function runMlPrediction(modelType, inputData) {
    const response = await api.post("api/ml/predict", {
        modelType,
        inputData,
    });

    return response.data;
}
