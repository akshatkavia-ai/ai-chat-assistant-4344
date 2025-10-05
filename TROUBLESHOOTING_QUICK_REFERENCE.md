# Frontend Connection - Quick Troubleshooting Reference

## 🔍 Quick Diagnostics

### 1. Check Console Logs
```
Open DevTools (F12) → Console tab
Look for: "[API] Final resolved base URL: <url>"
```

**Expected**: URL should match your backend location

### 2. Check Connection Banner
- **No banner** = ✅ Connected
- **Blue banner** = 🔄 Checking connection
- **Red banner** = ❌ Connection failed (read the error message)

### 3. Test Backend Directly
```bash
curl https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001/api/health
# Expected: {"status":"ok","gemini_configured":true,"model":"..."}
```

## 🚨 Common Issues & Fixes

### Issue: "Cannot connect to backend"

**Quick Fix Options:**

**A) Backend not running**
```bash
# Check if backend is up
curl https://your-backend:3001/api/health
```

**B) Wrong URL detected**
```bash
# Override with correct URL
echo "REACT_APP_API_BASE_URL=https://correct-url:3001" >> .env
# RESTART FRONTEND
pkill -f "react-scripts" && npm start
```

**C) CORS not configured**
```bash
# Check backend CORS includes your frontend URL
# Backend .env should have:
# ALLOWED_ORIGINS=https://your-frontend:3000
```

### Issue: CORS Error in Console

**Symptoms**: `blocked by CORS policy`

**Fix**: Update backend `.env`
```bash
# Add frontend URL to backend ALLOWED_ORIGINS
# Format: https://hostname:3000
# Example: ALLOWED_ORIGINS=http://localhost:3000,https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3000
```

### Issue: Wrong URL Auto-Detected

**Symptoms**: Console shows unexpected URL

**Fix**: Set explicit URL
```bash
# Edit .env
REACT_APP_API_BASE_URL=https://your-actual-backend:3001

# Restart (mandatory for CRA)
npm start
```

### Issue: .env Changes Not Applied

**Cause**: Create React App requires restart

**Fix**:
```bash
# Kill dev server
lsof -ti:3000 | xargs kill -9

# Start again
npm start
```

## 🔧 Auto-Detection Logic

### Priority Order:
1. **REACT_APP_API_BASE_URL** (if set in .env)
2. **Auto-detect**: `${protocol}//${hostname}:3001`
3. **Fallback**: `http://localhost:3001`

### To Verify Detection:
```javascript
// Check browser console for:
"[API] Using REACT_APP_API_BASE_URL from environment: ..."
// OR
"[API] Auto-detected backend URL from current host: ..."
// OR
"[API] Using localhost fallback"
```

## ⚡ Quick Commands

### Restart Frontend
```bash
cd ai-chat-assistant-4344/ai_copilot_frontend
lsof -ti:3000 | xargs kill -9
npm start
```

### Test Backend
```bash
curl https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001/api/health
```

### Test Backend with CORS
```bash
curl -I -H "Origin: https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3000" \
  https://vscode-internal-34116-beta.beta01.cloud.kavia.ai:3001/api/health | grep -i access
```

### Check CORS Configuration
```bash
cat ai-chat-assistant-4322/ai_copilot_backend/.env | grep ALLOWED_ORIGINS
```

### View Current Frontend .env
```bash
cat ai-chat-assistant-4344/ai_copilot_frontend/.env
```

## 📝 Checklist for Connection Issues

- [ ] Backend is running (curl test passes)
- [ ] Console shows correct base URL
- [ ] Frontend URL in backend ALLOWED_ORIGINS
- [ ] Frontend restarted after .env changes
- [ ] No proxy/firewall blocking connection
- [ ] Both services use same protocol (http or https)

## 🎯 Expected Behavior

### On App Load:
1. Base URL resolved (check console)
2. Health check performed automatically
3. Connection status banner shows result
4. If online: banner disappears, chat ready
5. If offline: red banner with diagnostics

### On Message Send:
1. Message sent to `/api/chat`
2. Loading indicator shown
3. Response rendered in chat
4. Errors shown in red box with details

## 💡 Pro Tips

- **Auto-detection works** in most scenarios - only set `REACT_APP_API_BASE_URL` if needed
- **Always restart** after changing `.env` (CRA requirement)
- **Check DevTools** Network tab for detailed request/response info
- **CORS requires exact match** - protocol, hostname, and port must match
- **Connection banner** is your first indicator - read it carefully

## 📞 Need More Help?

See full documentation:
- `README.md` - Complete setup and troubleshooting guide
- `FRONTEND_CONNECTION_FIX_COMPLETE.md` - Implementation details
- `.env.example` - Environment variable documentation
