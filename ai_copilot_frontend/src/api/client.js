import axios from 'axios';

// Resolve base URL from environment variable
// If not set, default to localhost for local development
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Log the resolved base URL for diagnostics
console.info('[API] Base URL:', BASE_URL);

/**
 * Axios instance configured for backend API communication
 */
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 
    'Content-Type': 'application/json' 
  },
  timeout: 30000, // 30 second timeout
  withCredentials: false // Set to true only if using cookies/sessions
});

/**
 * PUBLIC_INTERFACE
 * Send a message to the AI assistant and receive a response
 * 
 * @param {string} message - The user's message to send
 * @returns {Promise<string>} The AI assistant's reply
 * @throws {Error} If the request fails
 */
export async function sendMessage(message) {
  try {
    const { data } = await api.post('/api/chat', { message });
    return data.reply;
  } catch (error) {
    // Enhanced error handling with detailed diagnostics
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const url = error.config?.url || '/api/chat';
      const detail = error.response.data?.detail || 'Server error';
      console.error(`[API] Server error ${status} at ${BASE_URL}${url}:`, detail);
      throw new Error(`Server error (${status}): ${detail}`);
    } else if (error.request) {
      // Request made but no response received (network/CORS issue)
      const url = error.config?.url || '/api/chat';
      console.error(`[API] Network/CORS error - no response from ${BASE_URL}${url}`);
      console.error('[API] Possible causes:');
      console.error('  1. Backend is not running');
      console.error('  2. CORS is not configured correctly');
      console.error('  3. Wrong backend URL in .env file');
      console.error('  4. Network/firewall blocking the request');
      throw new Error(`Cannot connect to backend at ${BASE_URL}. Check console for details.`);
    } else {
      // Something else happened
      console.error('[API] Unexpected error:', error.message);
      throw new Error(`Unexpected error: ${error.message}`);
    }
  }
}

/**
 * PUBLIC_INTERFACE
 * Check backend health status
 * 
 * @returns {Promise<object>} Health status object
 */
export async function checkHealth() {
  try {
    const { data } = await api.get('/api/health');
    console.info('[API] Health check succeeded:', data);
    return data;
  } catch (error) {
    console.error('[API] Health check failed:', error.message);
    throw error;
  }
}
