# AI Copilot Frontend Container

## Project Overview

This is the frontend container for the AI Copilot application - a modern React + TypeScript web application built with Vite that provides a user-friendly chat interface for interacting with an AI assistant. The frontend communicates with the FastAPI backend to send user messages and display AI-generated responses in real-time.

## Architecture

- **Framework**: React 18.2.0 + TypeScript
- **Build Tool**: Vite 5.0
- **HTTP Client**: Axios 1.6.0
- **Styling**: Inline styles with Ocean Professional theme
- **Port**: 3000

## Prerequisites

Before running this container, ensure you have:

- Node.js 16 or higher
- npm (Node package manager)
- Backend service running on port 3001
- Access to the preview environment or local development setup

## Quick Start

### 1. Install Dependencies

```bash
cd ai-chat-assistant-4344/ai_copilot_frontend
npm install
```

### 2. Configure Environment Variables

The `.env` file should already exist. Verify it contains the required variables:

```bash
cat .env
```

If not present, create it with:

```bash
cp .env.example .env
```

### 3. Set Backend URL

Edit the `.env` file to point to your backend service:

```env
VITE_API_BASE_URL=https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001
```

### 4. Run Preview

The frontend service is automatically started in the preview environment. Access it at:

- **Frontend URL**: https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3000

### 5. Manual Start (If Needed)

```bash
cd ai-chat-assistant-4344/ai_copilot_frontend
npm run dev
```

The development server will start on port 3000 with hot-reload enabled.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | Auto-detected | Backend API base URL. If not set, automatically uses `protocol://hostname:3001` based on current location. |

### Example .env File

```env
# Backend API Base URL (no trailing slash)
VITE_API_BASE_URL=https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001
```

### Auto-Detection

If `VITE_API_BASE_URL` is not set, the frontend automatically constructs the backend URL using:
- Same protocol as frontend (http/https)
- Same hostname as frontend
- Port 3001 (backend default port)

This makes the app work seamlessly in preview environments without manual configuration.

## API Integration

The frontend communicates with the backend using Axios. The API client is configured in `src/api/client.ts`.

### Endpoints Used

- `GET /api/health` - Check backend health and configuration
- `POST /api/chat` - Send user messages and receive AI responses

### Base URL Resolution

Priority order:
1. `VITE_API_BASE_URL` environment variable (if set)
2. Auto-detected: `${window.location.protocol}//${window.location.hostname}:3001`
3. Fallback: `http://localhost:3001` (non-browser contexts)

## Base URL Rules

The frontend API base URL follows this pattern:

- **Local Development**: `http://localhost:3001`
- **Preview Environment**: `https://vscode-internal-{port}-beta.beta01.cloud.kavia.ai:3001`

When the preview domain changes, you must update:
1. Frontend `.env` → `VITE_API_BASE_URL` (point to new backend URL)
2. Backend `.env` → `ALLOWED_ORIGINS` (include new frontend URL)

## Project Structure

```
ai-chat-assistant-4344/ai_copilot_frontend/
├── .env                          # Environment configuration (git-ignored)
├── .env.example                  # Environment template
├── package.json                  # Node dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
├── index.html                    # HTML entry point
└── src/
    ├── main.tsx                  # React entry point
    ├── App.tsx                   # Main application component
    └── api/
        └── client.ts             # Axios API client
```

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server on port 3000 with hot-reload.

### Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory.

### Preview
```bash
npm run preview
```
Serves the production build locally for testing on port 3000.

## Theme & Styling

The application uses the **Ocean Professional** theme with the following color scheme:

- **Primary**: `#2563EB` (Blue)
- **Secondary**: `#F59E0B` (Amber)  
- **Background**: `#f9fafb` (Light gray)
- **Surface**: `#ffffff` (White)
- **Text**: `#111827` (Dark gray)

Styling is applied using inline styles for simplicity and performance. The design follows modern principles with:
- Clean, minimalist aesthetic
- Rounded corners (8-12px border-radius)
- Subtle borders and shadows
- Smooth transitions
- Responsive layout

## Troubleshooting

### Issue: Cannot connect to backend

**Symptoms**: 
- Error message: "Cannot connect to backend at..."
- Messages not sending
- Health check fails

**Causes**:
- Backend not running on port 3001
- Wrong `VITE_API_BASE_URL` in `.env`
- CORS not configured on backend

**Solution**:
```bash
# 1. Check backend is running
curl https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001/api/health

# 2. Verify frontend .env file
cat ai-chat-assistant-4344/ai_copilot_frontend/.env

# Should show:
# VITE_API_BASE_URL=https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001

# 3. Check browser console for base URL
# Open DevTools (F12), look for: "[API] Base URL: ..."

# 4. Restart frontend if .env changed
pkill -f "vite"
npm run dev
```

### Issue: CORS errors in browser console

**Symptoms**: 
- Console error: "blocked by CORS policy"
- Network requests show status 0 or "failed"

**Causes**:
- Frontend URL not in backend's `ALLOWED_ORIGINS`
- Protocol mismatch (http vs https)
- Port mismatch

**Solution**:
```bash
# Check backend CORS configuration
cat ai-chat-assistant-4322/ai_copilot_backend/.env | grep ALLOWED_ORIGINS

# Should include exact frontend URL:
# ALLOWED_ORIGINS=http://localhost:3000,https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3000

# If not, update backend .env and restart backend
```

### Issue: Preview domain changed

**Symptoms**:
- App worked before but now shows connection errors
- Different URL in browser than in .env

**Solution**:
```bash
# 1. Check your current preview URL (from running containers info or browser)
# Example: https://vscode-internal-12345-beta.beta01.cloud.kavia.ai:3000

# 2. Update frontend .env
# Edit ai-chat-assistant-4344/ai_copilot_frontend/.env
# Set: VITE_API_BASE_URL=https://vscode-internal-12345-beta.beta01.cloud.kavia.ai:3001

# 3. Update backend CORS
# Edit ai-chat-assistant-4322/ai_copilot_backend/.env  
# Add to ALLOWED_ORIGINS: https://vscode-internal-12345-beta.beta01.cloud.kavia.ai:3000

# 4. Restart both services
```

### Issue: Port 3000 already in use

**Symptoms**: "Port 3000 is already in use" error on start

**Solution**:
```bash
# Kill existing process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart frontend
npm run dev
```

### Issue: Dependencies not installed

**Symptoms**:
- "Module not found" errors
- Build fails with missing packages

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or update specific package
npm install axios@^1.6.0
```

### Issue: Build errors

**Symptoms**: TypeScript errors or build failures

**Solution**:
```bash
# Check TypeScript errors
npx tsc --noEmit

# Clean build
rm -rf dist
npm run build

# If persists, clear cache
rm -rf node_modules/.vite
npm run dev
```

### Issue: 4xx/5xx Errors from backend

**400 Bad Request**:
- Check message is not empty before sending
- Ensure proper JSON format

**500 Internal Server Error**:
- Backend may not have API key configured
- Check backend logs for details
- Verify backend health endpoint

**Solution**:
```bash
# Test backend directly
curl -X POST https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"test"}'

# Check backend logs for error details
```

### Issue: Network tab shows failed requests

**Symptoms**: Browser Network tab shows status 0 or "failed"

**Checks**:
1. **CORS**: Check for CORS errors in console
2. **Backend Running**: Verify backend is accessible
3. **URL Correct**: Confirm `VITE_API_BASE_URL` matches backend
4. **HTTPS**: Ensure protocol matches (http vs https)

## Health Check Steps

### Quick Browser Test

1. Open frontend in browser: https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3000
2. Open DevTools (F12)
3. Check Console tab for: `[API] Base URL: https://...`
4. Verify no CORS errors
5. Send a test message in the chat

### Console Checks

**Expected console output on load:**
```
[API] Base URL: https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001
```

**No errors should appear** when:
- Page loads
- Sending messages
- Receiving responses

### Network Tab Verification

1. Open DevTools → Network tab
2. Send a message in chat
3. Look for `/api/chat` request

**Expected**:
- Status: `200 OK`
- Response Type: `application/json`
- Headers include: `access-control-allow-origin`

### Manual API Test

```bash
# Test from command line
curl -X POST https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001/api/chat \
     -H "Content-Type: application/json" \
     -H "Origin: https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3000" \
     -d '{"message":"Hello"}'
```

Expected: JSON response with `reply` field.

## Important Notes

- **Service Restart Required**: After changing `.env` variables, restart the frontend service (`npm run dev`) for changes to take effect.
- **CORS Dependency**: Frontend requires backend to include its exact origin in `ALLOWED_ORIGINS`.
- **Auto-Detection**: If `VITE_API_BASE_URL` is not set, the app auto-detects the backend URL based on current host.
- **Port Consistency**: Frontend (3000) and Backend (3001) ports should remain consistent across environments.

## Development Tips

### Hot Reload
Vite provides instant hot-reload for most changes. You don't need to refresh the browser manually.

### DevTools
Press F12 to open browser DevTools for:
- Console logs (debugging)
- Network requests (API calls)
- React components (with React DevTools extension)

### Environment Variables
Remember: Vite environment variables must start with `VITE_` prefix to be accessible in the frontend code.

### API Base URL Logging
The API client logs the base URL on initialization. Check the browser console to verify it's correct.

## Production Build

### Build for Production
```bash
npm run build
```

This creates optimized files in `dist/` directory with:
- Minified JavaScript/CSS
- Tree-shaking (remove unused code)
- Code splitting
- Asset optimization

### Test Production Build
```bash
npm run preview
```

This serves the production build locally for testing before deployment.

### Build Output
```
dist/
├── index.html           # Entry HTML
├── assets/
│   ├── index-[hash].js  # Bundled JavaScript
│   └── index-[hash].css # Bundled CSS (if any)
└── vite.svg            # Assets
```

## Production Deployment

For production deployment, see [DEPLOYMENT.md](../ai-chat-assistant-4322/DEPLOYMENT.md) in the backend directory.

Key considerations:
- Build with `npm run build`
- Serve `dist/` folder via static hosting or CDN
- Set `VITE_API_BASE_URL` to production backend URL
- Enable HTTPS
- Configure CDN caching headers

## Support

For additional help, refer to:
- [Backend README](../ai-chat-assistant-4322/ai_copilot_backend/README.md) - Backend setup guide
- [TROUBLESHOOTING.md](../ai-chat-assistant-4322/TROUBLESHOOTING.md) - Detailed troubleshooting
- [CONNECTIVITY_FIX.md](../ai-chat-assistant-4322/CONNECTIVITY_FIX.md) - CORS fixes
- Vite Documentation: https://vitejs.dev/
- React Documentation: https://react.dev/

## License

Part of the Kavia AI Copilot application suite.
