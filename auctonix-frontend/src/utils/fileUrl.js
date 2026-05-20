const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://auctonix-backend.onrender.com";

// Placeholder image for when backend images fail to load
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e0e0e0' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='18' fill='%23999' text-anchor='middle' dy='.3em'%3EImage Loading...%3C/text%3E%3C/svg%3E";

export const toAbsoluteUrl = (path) => {
    if (!path || path.trim() === '') return PLACEHOLDER_IMAGE;
    if (path.startsWith('http')) return path;
    if (path.startsWith('data:')) return path;

    // Ensure proper path formatting
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
};