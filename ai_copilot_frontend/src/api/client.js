import axios from 'axios';

// Resolve base URL with priority: env variable > preview HTTPS URL > localhost fallback
const BASE_URL = process.env.REACT_APP_API_BASE_URL 
  || 'https://vscode-internal-20837-beta.beta01.cloud.kavia.ai:3001'
  || 'http://localhost:3001';

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
  timeout: 30000 // 30 second timeout
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
      console.error(`[API] Network error - no response from ${BASE_URL}${url}`);
      throw new Error(`Cannot connect to backend at ${BASE_URL}. Check network, CORS, or if server is running.`);
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
