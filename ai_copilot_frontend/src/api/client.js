import axios from 'axios';

// Dynamically resolve base URL from current host with port 3001
// Priority: env variable > derive from window.location > localhost fallback
const deriveBaseURL = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // Derive from current window location (supports both :3000 and :4000 frontends)
  if (typeof window !== 'undefined' && window.location) {
    const protocol = window.location.protocol; // https: or http:
    const hostname = window.location.hostname; // vscode-internal-20620-beta.beta01.cloud.kavia.ai
    return `${protocol}//${hostname}:3001`;
  }
  
  // Fallback for local development
  return 'http://localhost:3001';
};

const BASE_URL = deriveBaseURL();

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
