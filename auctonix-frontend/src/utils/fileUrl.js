const API_BASE_URL="https://auctonix-backend.onrender.com";

export const toAbsoluteUrl=(path)=>{
    if(!path) return "";
    if(path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
}