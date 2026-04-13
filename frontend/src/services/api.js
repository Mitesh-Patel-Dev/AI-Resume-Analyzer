import axios from "axios";

const API = axios.create({
    baseURL: "/api",
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Auth Services ───
export const signupUser = (data) => API.post("/auth/signup", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// ─── Resume Services ───
export const uploadResume = (formData) =>
    API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const getMyResumes = () => API.get("/resume/my-resumes");
export const getResumeById = (id) => API.get(`/resume/${id}`);
export const deleteResume = (id) => API.delete(`/resume/${id}`);
export const getReportUrl = (id) => `/api/resume/${id}/report`;

export default API;
