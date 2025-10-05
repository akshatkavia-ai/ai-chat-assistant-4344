# AI Copilot Frontend (React)

Modern React-based frontend for the AI Copilot chat application with Ocean Professional theme styling.

## Features

- Real-time chat interface with AI assistant
- Axios-based API communication with resilient base URL resolution
- **Auto-detection** of backend URL from current host
- Connection status check at app startup
- Ocean Professional theme with modern styling
- Responsive design with smooth animations
- Error handling with CORS detection
- Loading states and auto-scroll functionality

## Technology Stack

- **Framework**: React 18.2.0 (Create React App)
- **Build Tool**: react-scripts 5.0.1
- **HTTP Client**: Axios 1.6.0
- **Styling**: Inline styles with Ocean Professional theme
- **Port**: 3000

## Environment Variables

Create a `.env` file in the frontend root directory. The `REACT_APP_API_BASE_URL` variable is **optional** due to auto-detection:

```env
# Optional - only set if you need to override auto-detection
REACT_APP_API_BASE_URL=https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001

# Optional - typically handled by backend
REACT_APP_GOOGLE_GEMINI_API_KEY=
```

**Important**: Create React App requires environment variables to be prefixed with `REACT_APP_` to be accessible in the browser.

### Base URL Auto-Detection

The frontend automatically detects the backend URL if `REACT_APP_API_BASE_URL` is not set:

**Priority Order:**
1. ✅ **REACT_APP_API_BASE_URL** (if explicitly set and non-empty)
2. ✅ **Auto-detect**: `${window.location.protocol}//${window.location.hostname}:3001`
3. ✅ **Fallback**: `http://localhost:3001`

This means the app works seamlessly across environments without manual configuration!

## Setup

1. Install dependencies:
```bash
npm install
```

2. **(Optional)** Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. **(Optional)** Update the `.env` file only if you need to override auto-detection

## Running the Application

The application is auto-started by the preview environment on port 3000.

To run manually:
```bash
npm start
```

The app will open at http://localhost:3000

**Note**: After changing `.env` variables, you **must restart** the development server for changes to take effect.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Project Structure

```
src/
├── api/
│   └── client.js       # Axios client with auto-detection and API functions
├── components/
│   └── Chat.js         # Main chat component
├── theme.js            # Ocean Professional theme configuration
├── App.js              # Main app component with connection status
└── index.js            # App entry point
```

## API Integration

The frontend communicates with the FastAPI backend using Axios:
- `GET /api/health` - Check backend health status
- `POST /api/chat` - Send messages and receive AI responses

### How Base URL Resolution Works

The API client (`src/api/client.js`) intelligently resolves the backend URL:

```javascript
// 1. Check environment variable first
if (process.env.REACT_APP_API_BASE_URL) {
  return process.env.REACT_APP_API_BASE_URL;
}

// 2. Auto-detect from current window location
if (window.location) {
  return `${window.location.protocol}//${window.location.hostname}:3001`;
}

// 3. Fallback to localhost
return 'http://localhost:3001';
```

This makes the app work across:
- ✅ Local development (`localhost:3001`)
- ✅ Preview environments (`beta01.cloud.kavia.ai`)
- ✅ Custom deployments (set `REACT_APP_API_BASE_URL`)

## Connection Status Check

The app performs an automatic health check on startup:

- **🔄 Checking**: Shows blue banner while verifying connection
- **✅ Online**: Banner disappears, chat is ready
- **⚠️ Offline**: Shows red banner with:
  - Detected backend URL
  - CORS issue detection
  - Debugging hints

## Troubleshooting

### Base URL Auto-Detection

**How to verify the detected URL:**

1. Open your app in the browser
2. Press F12 to open DevTools
3. Check the Console tab
4. Look for: `[API] Final resolved base URL: <url>`

**If the URL is wrong:**

**Option A**: Set environment variable (override auto-detect)
```bash
# Edit .env file
echo "REACT_APP_API_BASE_URL=https://your-backend-url:3001" > .env

# Restart frontend
lsof -ti:3000 | xargs kill -9
npm start
```

**Option B**: Fix hostname (if running in preview)
```bash
# Verify you're accessing the correct frontend URL
# The backend URL will auto-detect based on your hostname
```

### Issue: Cannot connect to backend

**Symptoms**: 
- Red connection banner at top
- Error message: "Cannot connect to backend at..."
- Messages not sending

**Solution:**
```bash
# 1. Check detected URL in browser console
# Look for: [API] Final resolved base URL: <url>

# 2. Verify backend is running at that URL
curl https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001/api/health

# 3. If backend is running but unreachable, check CORS (see next section)

# 4. If you need to override auto-detection:
echo "REACT_APP_API_BASE_URL=https://your-backend-url:3001" >> .env
lsof -ti:3000 | xargs kill -9
npm start
```

### Issue: CORS errors in browser console

**Symptoms**: 
- Console error: "blocked by CORS policy"
- Network requests show status 0 or "failed"
- Red banner shows "Possible CORS issue"

**Root Cause**: Backend `ALLOWED_ORIGINS` doesn't include your frontend URL

**Solution:**
```bash
# 1. Check your current frontend URL
echo "Frontend URL: $(echo $BROWSER_URL | sed 's/:3001/:3000/')"

# 2. Check backend CORS configuration
cat ai-chat-assistant-4322/ai_copilot_backend/.env | grep ALLOWED_ORIGINS

# 3. Update backend .env to include your frontend URL
# Example:
# ALLOWED_ORIGINS=http://localhost:3000,https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3000

# 4. Restart backend for changes to take effect
```

**Important**: The frontend origin must match EXACTLY (protocol, hostname, port).

### Issue: Wrong backend URL auto-detected

**Symptoms**:
- Console shows unexpected URL
- Connection fails even though backend is running

**Causes**:
- Accessing frontend through proxy/tunnel with different hostname
- Running in non-standard environment
- Browser extensions modifying window.location

**Solution**:
```bash
# Override auto-detection with explicit URL
cat > .env << EOF
REACT_APP_API_BASE_URL=https://your-actual-backend:3001
EOF

# Restart frontend
lsof -ti:3000 | xargs kill -9
npm start
```

### Issue: Environment variables not updating

**Cause**: Create React App embeds environment variables at build time. Changes to `.env` require a restart.

**Solution**:
```bash
# Stop the dev server (Ctrl+C in terminal, or)
lsof -ti:3000 | xargs kill -9

# Start again
npm start

# For production builds, rebuild:
npm run build
```

### Issue: Preview domain changed

**Symptoms**:
- App worked before but now shows connection errors
- Different URL in browser than expected

**Solution with auto-detection** (recommended):
```bash
# 1. Clear any hardcoded URL from .env
# Edit .env and remove or comment out REACT_APP_API_BASE_URL

# 2. Verify auto-detection logic will work
# The new URL should follow pattern: https://<hostname>:3000 (frontend)
# Backend should be at: https://<hostname>:3001

# 3. Update backend CORS to allow new frontend origin
# Edit backend .env ALLOWED_ORIGINS

# 4. Restart both services
```

**Solution with explicit URL** (if auto-detect doesn't work):
```bash
# 1. Get your new preview URL
echo "Current URL: $BROWSER_URL"

# 2. Update frontend .env
# Edit ai-chat-assistant-4344/ai_copilot_frontend/.env
# Set: REACT_APP_API_BASE_URL=https://vscode-internal-XXXXX-beta.beta01.cloud.kavia.ai:3001

# 3. Update backend CORS
# Edit ai-chat-assistant-4322/ai_copilot_backend/.env  
# Add to ALLOWED_ORIGINS: https://vscode-internal-XXXXX-beta.beta01.cloud.kavia.ai:3000

# 4. Restart both services
```

### Issue: Port 3000 already in use

**Solution**:
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Start frontend
npm start
```

### Debugging Checklist

**Step 1**: Check browser console
```
Open DevTools (F12) → Console tab
Look for:
  [API] Using REACT_APP_API_BASE_URL from environment: <url>
  OR
  [API] Auto-detected backend URL from current host: <url>
  [API] Final resolved base URL: <url>
```

**Step 2**: Verify connection status banner
```
• Blue banner = checking connection
• No banner = connected successfully
• Red banner = connection failed (check error details)
```

**Step 3**: Test backend directly
```bash
# Replace with your detected URL from console
curl https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001/api/health

# Should return: {"status":"ok","gemini_configured":true,"model":"..."}
```

**Step 4**: Check Network tab
```
DevTools (F12) → Network tab
Send a test message
Look for /api/chat request:
  • Status 200 = Success
  • Status 0 or failed = CORS/network issue
  • Status 4xx/5xx = Backend error
```

**Step 5**: Verify CORS headers
```
In Network tab, click on /api/health request
Check Response Headers:
  • access-control-allow-origin should include your frontend origin
  • If missing = CORS not configured correctly on backend
```

## Advanced Configuration

### Override Auto-Detection

To explicitly set the backend URL (disables auto-detection):

```bash
# Create/edit .env file
cat > .env << EOF
REACT_APP_API_BASE_URL=https://your-backend.com:3001
EOF

# Restart
npm start
```

### Use Different Backend Port

If your backend runs on a different port:

```bash
# Set explicit URL with custom port
echo "REACT_APP_API_BASE_URL=https://your-host:8080" > .env
npm start
```

### Disable Auto-Detection

Auto-detection is always active as a fallback. To ensure it never runs:

```bash
# Set explicit URL (even for localhost)
echo "REACT_APP_API_BASE_URL=http://localhost:3001" > .env
npm start
```

## Theme

The application uses the **Ocean Professional** theme with:
- Primary color: Blue (#2563EB)
- Secondary color: Amber (#F59E0B)
- Modern aesthetic with rounded corners and subtle shadows
- Smooth transitions and gradients

## Browser Support

Supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Important Notes

- **Framework**: This is Create React App (CRA), not Vite
- **Environment Variables**: Must be prefixed with `REACT_APP_` for CRA
- **Auto-Detection**: Backend URL is auto-detected by default, no manual config needed
- **Restart Required**: Changes to `.env` require restarting the dev server
- **CORS Dependency**: Backend must whitelist the exact frontend origin
- **Connection Check**: App verifies backend connection on startup

## Health Check

### Quick Browser Test

1. Open: https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3000
2. Open DevTools (F12) → Console
3. Look for: `[API] Final resolved base URL: https://...`
4. Check for connection status banner (should disappear if online)
5. Send a test message

### Expected Console Output

```
[API] Auto-detected backend URL from current host: https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001
[API] Final resolved base URL: https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001
[App] Performing initial health check...
[API] Checking backend health at: https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001/api/health
[API] Health check succeeded: {status: 'ok', gemini_configured: true, model: '...'}
[App] Backend connection verified
```

### Manual API Test

```bash
# Test backend from command line
curl -X POST https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001/api/chat \
     -H "Content-Type: application/json" \
     -H "Origin: https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3000" \
     -d '{"message":"Hello"}'
```

Expected: JSON response with `reply` field.

## Development Tips

### Hot Reload
CRA provides instant hot-reload for most code changes. However, `.env` changes require a full restart.

### DevTools
Press F12 to open browser DevTools for:
- Console logs (debugging, base URL detection)
- Network requests (API calls, CORS issues)
- React components (with React DevTools extension)

### Connection Status Banner
The app shows a status banner when:
- 🔄 **Checking**: Initial health check in progress
- ⚠️ **Offline**: Cannot connect to backend (with debugging info)
- ✅ **Online**: Banner hidden, app ready to use

### API Base URL Logging
The API client logs detailed information for debugging:
```javascript
[API] Using REACT_APP_API_BASE_URL from environment: <url>
// OR
[API] Auto-detected backend URL from current host: <url>

[API] Final resolved base URL: <url>
```

### CORS Error Detection
Errors are enriched with `isCors` flag:
```javascript
try {
  await sendMessage('Hello');
} catch (error) {
  if (error.isCors) {
    // Handle CORS-specific error
    console.log('Backend CORS needs configuration');
  }
}
```

## Production Deployment

### Build for Production
```bash
npm run build
```

This creates optimized files in `build/` directory with:
- Minified JavaScript/CSS
- Tree-shaking (removes unused code)
- Code splitting
- Asset optimization

### Test Production Build
```bash
npm install -g serve
serve -s build -l 3000
```

### Deployment Checklist
- [ ] Decide: Use auto-detection or set explicit `REACT_APP_API_BASE_URL`
- [ ] If using explicit URL: Set `REACT_APP_API_BASE_URL` to production backend
- [ ] Run `npm run build`
- [ ] Serve `build/` folder via static hosting or CDN
- [ ] Enable HTTPS
- [ ] Configure CDN caching headers
- [ ] Update backend CORS to include production frontend URL
- [ ] Test connection status banner shows ✅ online

### Deployment with Auto-Detection

If using auto-detection in production:

1. Ensure frontend and backend share the same hostname
2. Backend must be on port 3001 (or set explicit URL)
3. Configure backend CORS to allow frontend origin
4. Test thoroughly in staging environment first

## Support

For additional help, refer to:
- [Create React App Documentation](https://create-react-app.dev/)
- [React Documentation](https://react.dev/)
- [Axios Documentation](https://axios-http.com/)

## License

Part of the Kavia AI Copilot application suite.
