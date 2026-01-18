import axios from "axios";

const api=axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
})

export default api;

// export const loginUser = (data) => API.post("/auth/login", data);
// export const registerUser = (data) => API.post("/auth/register", data);