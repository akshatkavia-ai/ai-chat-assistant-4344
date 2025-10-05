import axios from 'axios';

// Get base URL from environment variable or use default
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

/**
 * Axios instance configured for backend API communication
 */
export const api = axios.create({
  baseURL,
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
    // Re-throw with more context
    if (error.response) {
      throw new Error(error.response.data?.detail || 'Failed to get response from AI');
    } else if (error.request) {
      throw new Error('Cannot connect to backend server. Please ensure it is running.');
    } else {
      throw new Error('An unexpected error occurred');
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
  const { data } = await api.get('/api/health');
  return data;
}
