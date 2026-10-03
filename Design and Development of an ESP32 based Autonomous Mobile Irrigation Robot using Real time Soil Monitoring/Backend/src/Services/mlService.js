const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://10.143.171.45:7860";

const ML_SERVICE_TIMEOUT = Number(process.env.ML_SERVICE_TIMEOUT || 5000);

const callMLService = async (endpoint, payload) => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {controller.abort();}, ML_SERVICE_TIMEOUT);

    try {
        const response = await fetch(`${ML_SERVICE_URL}${endpoint}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.error || "ML service request failed."
            );
        }

        return data;
    } finally {
        clearTimeout(timeout);
    }
};

export const predictCrop = async (payload) => {
    return callMLService(
        "/api/predict-crop",
        payload
    );
};

export const predictFertilizer = async (payload) => {
    return callMLService(
        "/api/predict-fertilizer",
        payload
    );
};