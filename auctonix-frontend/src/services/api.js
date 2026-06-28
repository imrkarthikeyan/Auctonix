import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 35000
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Retry once on timeout (ECONNABORTED) for GET requests — covers Render cold-start
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;
        if (!config || !navigator.onLine) return Promise.reject(error);

        if (
            !config.__retried &&
            error.code === 'ECONNABORTED' &&
            config.method === 'get'
        ) {
            config.__retried = true;
            return api(config);
        }

        return Promise.reject(error);
    }
);

export default api;

// export const loginUser = (data) => API.post("/auth/login", data);
// export const registerUser = (data) => API.post("/auth/register", data);