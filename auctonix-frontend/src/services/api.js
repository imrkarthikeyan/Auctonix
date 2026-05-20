import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 8000
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Retry logic for failed requests
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        // Don't retry if no config or already retried
        if (!config || config.__retryCount === undefined) {
            config.__retryCount = 0;
        }

        config.__retryCount += 1;

        // Retry up to 2 times for network errors, only on GET requests
        if (
            config.__retryCount <= 2 &&
            (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') &&
            config.method === 'get'
        ) {
            // Wait before retrying (exponential backoff: 500ms, 1000ms)
            await new Promise(resolve => setTimeout(resolve, config.__retryCount * 500));
            return api(config);
        }

        return Promise.reject(error);
    }
);

export default api;

// export const loginUser = (data) => API.post("/auth/login", data);
// export const registerUser = (data) => API.post("/auth/register", data);