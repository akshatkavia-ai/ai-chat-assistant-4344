# AI Copilot Frontend (React)

Modern React-based frontend for the AI Copilot chat application with Ocean Professional theme styling.

## Features

- Real-time chat interface with AI assistant
- Axios-based API communication
- Ocean Professional theme with modern styling
- Responsive design with smooth animations
- Error handling and loading states
- Auto-scroll to latest messages

## Technology Stack

- **Framework**: React 18.2.0 (Create React App)
- **Build Tool**: react-scripts 5.0.1
- **HTTP Client**: Axios 1.6.0
- **Styling**: Inline styles with Ocean Professional theme
- **Port**: 3000

## Environment Variables

Create a `.env` file in the frontend root directory:

```env
REACT_APP_API_BASE_URL=https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001
```

**Important**: Create React App requires environment variables to be prefixed with `REACT_APP_` to be accessible in the browser.

This configures the backend API endpoint. If not specified, the app will auto-detect the backend URL based on the current hostname.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file if your backend runs on a different URL

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
│   └── client.js       # Axios client and API functions
├── components/
│   └── Chat.js         # Main chat component
├── theme.js            # Ocean Professional theme configuration
├── App.js              # Main app component
└── index.js            # App entry point
```

## Theme

The application uses the **Ocean Professional** theme with:
- Primary color: Blue (#2563EB)
- Secondary color: Amber (#F59E0B)
- Modern aesthetic with rounded corners and subtle shadows
- Smooth transitions and gradients

## API Integration

The frontend communicates with the FastAPI backend using Axios:
- `POST /api/chat` - Send messages and receive AI responses
- `GET /api/health` - Check backend health status

### Base URL Resolution (Priority Order)

1. **Environment Variable**: `REACT_APP_API_BASE_URL` (if explicitly set in `.env`)
2. **Auto-Detection**: `${window.location.protocol}//${window.location.hostname}:3001` (for beta01.cloud.kavia.ai domains)
3. **Fallback**: `http://localhost:3001` (local development)

This makes the app work seamlessly across environments without manual configuration.

## Browser Support

Supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Issue: Cannot connect to backend

**Symptoms**: 
- Error message: "Cannot connect to backend at..."
- Messages not sending
- Health check fails

**Solution**:
```bash
# 1. Verify backend is running
curl https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001/api/health

# 2. Check your .env file
cat .env
# Should show: REACT_APP_API_BASE_URL=https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001

# 3. Restart frontend after .env changes
# Kill the running process
lsof -ti:3000 | xargs kill -9

# Start again
npm start
```

### Issue: CORS errors in browser console

**Symptoms**: 
- Console error: "blocked by CORS policy"
- Network requests show status 0 or "failed"

**Solution**:
The backend must include the exact frontend origin in its `ALLOWED_ORIGINS` configuration. Check the backend `.env` file includes:
```
ALLOWED_ORIGINS=https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3000
```

### Issue: Wrong backend URL

**Symptoms**:
- Console shows: `[API] Base URL: https://vscode-internal-XXXXX-beta...`
- URL doesn't match your running backend

**Solution**:
1. Open browser DevTools (F12)
2. Check Console tab for the line: `[API] Base URL: ...`
3. Update `.env` file with correct URL
4. **Restart the frontend** (this is mandatory for CRA)

### Issue: Environment variables not updating

**Cause**: Create React App embeds environment variables at build time. Changes to `.env` require a restart.

**Solution**:
```bash
# Stop the dev server (Ctrl+C in terminal, or)
lsof -ti:3000 | xargs kill -9

# Start again
npm start
```

### Issue: Port 3000 already in use

**Solution**:
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Start frontend
npm start
```

### Debugging Tips

1. **Check Console Logs**: Open browser DevTools (F12) → Console tab
2. **Look for API Logs**: Messages prefixed with `[API]` show base URL and errors
3. **Network Tab**: DevTools → Network → Look for `/api/chat` requests
4. **Verify CORS Headers**: In Network tab, check Response Headers for `access-control-allow-origin`

## Important Notes

- **Framework**: This is Create React App (CRA), not Vite
- **Environment Variables**: Must be prefixed with `REACT_APP_` for CRA
- **Restart Required**: Changes to `.env` require restarting the dev server
- **CORS Dependency**: Backend must whitelist the exact frontend origin
- **Auto-Detection**: Backend URL is auto-detected from hostname if not explicitly set

## Health Check

### Quick Browser Test

1. Open: https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3000
2. Open DevTools (F12) → Console
3. Look for: `[API] Base URL: https://...`
4. Verify no CORS errors
5. Send a test message

### Expected Console Output

```
[API] Base URL: https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001
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
- Console logs (debugging)
- Network requests (API calls)
- React components (with React DevTools extension)

### Environment Variables in CRA
Remember: 
- Variables must start with `REACT_APP_` prefix
- They are embedded at build time
- Changes require restart

### API Base URL Logging
The API client logs the base URL on initialization. Check the browser console to verify it's correct:
```
[API] Base URL: https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001
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
- [ ] Set `REACT_APP_API_BASE_URL` to production backend URL
- [ ] Run `npm run build`
- [ ] Serve `build/` folder via static hosting or CDN
- [ ] Enable HTTPS
- [ ] Configure CDN caching headers
- [ ] Update backend CORS to include production frontend URL

## Support

For additional help, refer to:
- [Create React App Documentation](https://create-react-app.dev/)
- [React Documentation](https://react.dev/)
- [Axios Documentation](https://axios-http.com/)

## License

Part of the Kavia AI Copilot application suite.
