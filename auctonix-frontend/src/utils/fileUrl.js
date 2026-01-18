const API_BASE_URL="http://localhost:8080";

export const toAbsoluteUrl=(path)=>{
    if(!path) return "";
    if(path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
}