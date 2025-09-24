import axios from 'axios';

const axiosInstance = axios.create({
  // In dev, prefer http://localhost:5000 to avoid cross-site cookie headaches.
  // Your current Render URL is fine for prod; just ensure HTTPS + sameSite=None.
  baseURL: "http://localhost:5000",
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,

  // Tell axios which cookie/header names to use for CSRF
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'CSRF-Token',
});

// Session-expiry handling (your existing code)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      [401, 403].includes(error.response?.status) ||
      error.response?.data?.message === "Session expired. Please login again."
    ) {
      if (!window.sessionExpiredHandled) { 
        window.sessionExpiredHandled = true;
        const message = "Your session has expired. You will be redirected to the login page.";
        window.toast ? window.toast.error(message) : alert(message);

        localStorage.clear();
        sessionStorage.clear();
        document.cookie = "accessToken=; Max-Age=0; path=/;";

        setTimeout(() => (window.location.href = "/login"), 500);
      }
      return; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
