// Import axios library for making HTTP requests
import axios from "axios";

// Create an axios instance with custom configuration
// This centralizes all API calls and allows us to set default configurations
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL for all API endpoints - all requests will be prefixed with this
});

// Add a request interceptor to automatically attach authentication token to all requests
// Interceptors run before every request is sent to the server
api.interceptors.request.use((config) => {
  // Retrieve the authentication token from browser's localStorage
  const token = localStorage.getItem("token");

  // If a token exists, add it to the Authorization header
  // This allows the backend to verify the user's identity for protected routes
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Return the modified config so the request can proceed
  return config;
});

// Export the configured axios instance for use throughout the application
// Other components can import this to make authenticated API calls
export default api;
