import React, { useState, useEffect } from 'react';
import { Chat } from './components/Chat';
import { checkHealth, getBaseURL } from './api/client';

/**
 * PUBLIC_INTERFACE
 * Main App component for AI Copilot
 * Includes connection status check on mount
 */
function App() {
  const [connectionStatus, setConnectionStatus] = useState({
    checking: true,
    online: false,
    error: null,
    baseURL: getBaseURL()
  });

  // Check backend health on mount
  useEffect(() => {
    const performHealthCheck = async () => {
      try {
        console.info('[App] Performing initial health check...');
        await checkHealth();
        setConnectionStatus({
          checking: false,
          online: true,
          error: null,
          baseURL: getBaseURL()
        });
        console.info('[App] Backend connection verified');
      } catch (error) {
        console.error('[App] Backend connection failed:', error.message);
        setConnectionStatus({
          checking: false,
          online: false,
          error: error,
          baseURL: getBaseURL()
        });
      }
    };

    performHealthCheck();
  }, []);

  return (
    <div>
      {/* Connection Status Banner - only show if offline or checking */}
      {(connectionStatus.checking || !connectionStatus.online) && (
        <ConnectionStatusBanner status={connectionStatus} />
      )}
      
      {/* Main Chat Interface */}
      <Chat connectionStatus={connectionStatus} />
    </div>
  );
}

/**
 * Connection Status Banner Component
 * Shows connectivity state at the top of the app
 */
function ConnectionStatusBanner({ status }) {
  if (status.checking) {
    return (
      <div style={{
        background: '#3B82F6',
        color: 'white',
        padding: '8px 16px',
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: '500'
      }}>
        🔄 Checking backend connection...
      </div>
    );
  }

  if (!status.online) {
    const isCors = status.error?.isCors || false;
    
    return (
      <div style={{
        background: '#EF4444',
        color: 'white',
        padding: '12px 16px',
        fontSize: '13px',
        lineHeight: '1.5'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
          ⚠️ Backend Connection Failed
        </div>
        <div style={{ fontSize: '12px', opacity: 0.95 }}>
          <strong>Detected URL:</strong> {status.baseURL}
        </div>
        {isCors && (
          <div style={{ fontSize: '12px', opacity: 0.95, marginTop: '4px' }}>
            <strong>Possible CORS issue:</strong> Backend may not allow requests from {typeof window !== 'undefined' ? window.location.origin : 'this origin'}
          </div>
        )}
        <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '6px' }}>
          Check browser console (F12) for detailed diagnostics
        </div>
      </div>
    );
  }

  return null;
}

export default App;
