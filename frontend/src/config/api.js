import axios from 'axios';

const axiosInstance = axios.create({
// baseURL: "http://localhost:5000",
  baseURL: "https://hospital-managemnt-jwtu.onrender.com",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if ([401, 403].includes(error.response?.status) ||
        error.response?.data?.message === "Session expired. Please login again.") {
      
      if (!window.sessionExpiredHandled) { 
        window.sessionExpiredHandled = true; // prevent multiple triggers
        const message = "Your session has expired. You will be redirected to the login page.";
        window.toast ? window.toast.error(message) : alert(message);

        localStorage.clear();
        sessionStorage.clear();
        document.cookie = "accessToken=; Max-Age=0; path=/;";

        setTimeout(() => window.location.href = "/login", 500);
      }
      return; // Don't reject; prevents extra logging
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
