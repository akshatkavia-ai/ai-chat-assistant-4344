import axios from 'axios';

/**
 * Resolve API base URL with robust auto-detection:
 * Priority order:
 * 1. REACT_APP_API_BASE_URL environment variable (if explicitly set and non-empty)
 * 2. Default to preview backend URL if known
 * 3. Auto-detect from window.location: ${protocol}//${hostname}:3001
 * 4. Fallback to http://localhost:3001 for local development
 */
function resolveBaseURL() {
  // Priority 1: Explicit environment variable (Create React App uses REACT_APP_ prefix)
  const envBaseURL = process.env.REACT_APP_API_BASE_URL;
  if (envBaseURL && envBaseURL.trim() !== '') {
    console.info('[API] Using REACT_APP_API_BASE_URL from environment:', envBaseURL);
    return envBaseURL.trim();
  }
  
  // Priority 2: Use specified preview backend URL if environment variable is not set
  // This aligns with the requested explicit backend URL for the preview environment.
  const previewBackend = 'https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001';
  if (previewBackend) {
    console.info('[API] Using explicit preview backend URL:', previewBackend);
    return previewBackend;
  }

  // Priority 3: Auto-detection from window.location
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Construct backend URL using same protocol/hostname but port 3001
    const autoDetectedURL = `${protocol}//${hostname}:3001`;
    console.info('[API] Auto-detected backend URL from current host:', autoDetectedURL);
    return autoDetectedURL;
  }
  
  // Priority 4: Localhost fallback for non-browser contexts
  console.info('[API] Using localhost fallback');
  return 'http://localhost:3001';
}

const BASE_URL = resolveBaseURL();

// Log the resolved base URL for diagnostics
console.info('[API] Final resolved base URL:', BASE_URL);

/**
 * Axios instance configured for backend API communication
 */
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 
    'Content-Type': 'application/json' 
  },
  timeout: 30000, // 30 second timeout
  withCredentials: false // Set to false unless credentials are needed
});

/**
 * PUBLIC_INTERFACE
 * Check backend health status
 * 
 * @returns {Promise<object>} Health status object with { status, gemini_configured, model }
 * @throws {Error} Enhanced error with isCors flag if CORS issue detected
 */
export async function checkHealth() {
  try {
    console.info('[API] Checking backend health at:', `${BASE_URL}/api/health`);
    const { data } = await api.get('/api/health');
    console.info('[API] Health check succeeded:', data);
    return data;
  } catch (error) {
    const enrichedError = enrichError(error, '/api/health');
    console.error('[API] Health check failed:', enrichedError.message);
    throw enrichedError;
  }
}

/**
 * PUBLIC_INTERFACE
 * Send a message to the AI assistant and receive a response
 * 
 * @param {string} message - The user's message to send
 * @returns {Promise<string>} The AI assistant's reply
 * @throws {Error} Enhanced error with isCors flag if CORS issue detected
 */
export async function sendMessage(message) {
  try {
    console.info('[API] Sending message to:', `${BASE_URL}/api/chat`);
    const { data } = await api.post('/api/chat', { message });
    console.info('[API] Received response');
    return data.reply;
  } catch (error) {
    const enrichedError = enrichError(error, '/api/chat');
    console.error('[API] Send message failed:', enrichedError.message);
    throw enrichedError;
  }
}

/**
 * Enrich error with detailed diagnostics and CORS detection
 * 
 * @param {Error} error - The original axios error
 * @param {string} endpoint - The endpoint that was called
 * @returns {Error} Enriched error with additional properties
 */
function enrichError(error, endpoint) {
  const enriched = new Error();
  
  if (error.response) {
    // Server responded with error status (4xx, 5xx)
    const status = error.response.status;
    const detail = error.response.data?.detail || error.response.statusText || 'Server error';
    enriched.message = `Server error (${status}): ${detail}`;
    enriched.isCors = false;
    enriched.status = status;
    console.error(`[API] Server error ${status} at ${BASE_URL}${endpoint}:`, detail);
  } else if (error.request) {
    // Request made but no response received (network/CORS issue)
    // This typically indicates CORS blocking or network failure
    enriched.message = `Cannot connect to backend at ${BASE_URL}${endpoint}. This could be:\n` +
      `• CORS issue: Backend may not allow requests from ${window.location.origin}\n` +
      `• Network error: Backend may not be running or reachable\n` +
      `• Firewall/proxy blocking the connection\n\n` +
      `Detected base URL: ${BASE_URL}\n` +
      `Check browser console Network tab for more details.`;
    enriched.isCors = true; // Flag as potential CORS issue
    enriched.baseURL = BASE_URL;
    enriched.origin = typeof window !== 'undefined' ? window.location.origin : 'unknown';
    console.error(`[API] Network error - no response from ${BASE_URL}${endpoint}`);
    console.error('[API] Possible CORS issue. Backend ALLOWED_ORIGINS should include:', 
      typeof window !== 'undefined' ? window.location.origin : 'current origin');
    console.error('[API] Or backend may not be running. Try:', `curl ${BASE_URL}/api/health`);
  } else {
    // Something else happened during request setup
    enriched.message = `Unexpected error: ${error.message}`;
    enriched.isCors = false;
    console.error('[API] Unexpected error:', error.message);
  }
  
  return enriched;
}

/**
 * Get the current base URL being used
 * Useful for debugging and status displays
 * 
 * @returns {string} Current API base URL
 */
export function getBaseURL() {
  return BASE_URL;
}
