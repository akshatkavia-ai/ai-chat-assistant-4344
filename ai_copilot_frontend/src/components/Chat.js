import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../api/client';
import { theme } from '../theme';

/**
 * PUBLIC_INTERFACE
 * Chat component for AI Copilot interface
 * Provides real-time chat functionality with AI assistant
 */
export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handle sending a message to the AI assistant
   */
  const onSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    
    setError(null);
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessage(text);
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError(e.message || 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Enter key press to send message
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.colors.background, 
      color: theme.colors.text,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky', 
        top: 0, 
        zIndex: 10,
        background: theme.colors.surface,
        boxShadow: theme.shadow,
        padding: '16px 24px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.colors.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 36, 
            height: 36, 
            borderRadius: '50%', 
            background: theme.colors.primary, 
            opacity: 0.9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18
          }}>
            AI
          </div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>AI Copilot</h1>
        </div>
        <span style={{ fontSize: 12, color: theme.colors.textSecondary, fontWeight: 500 }}>
          Ocean Professional
        </span>
      </header>

      {/* Main chat area */}
      <main style={{
        flex: 1,
        maxWidth: 900, 
        width: '100%',
        margin: '0 auto', 
        padding: 16,
        display: 'flex', 
        flexDirection: 'column', 
        gap: 12
      }}>
        {/* Chat messages container */}
        <div style={{
          background: theme.colors.surface,
          borderRadius: theme.radius,
          boxShadow: theme.shadow,
          padding: 16,
          minHeight: '60vh',
          maxHeight: '70vh',
          overflowY: 'auto',
          backgroundImage: theme.colors.gradient,
          border: `1px solid ${theme.colors.border}`
        }}>
          {messages.length === 0 && (
            <div style={{ 
              color: theme.colors.textSecondary,
              textAlign: 'center',
              padding: '40px 20px'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
              <div style={{ fontSize: 16 }}>Start the conversation by sending a message.</div>
              <div style={{ fontSize: 14, marginTop: 8 }}>
                Ask me anything and I'll help you out!
              </div>
            </div>
          )}

          <div>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex', 
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 12,
                animation: 'fadeIn 0.3s ease-in'
              }}>
                <div style={{
                  maxWidth: '80%', 
                  padding: '10px 14px', 
                  borderRadius: 12,
                  background: m.role === 'user' ? theme.colors.primary : theme.colors.surface,
                  color: m.role === 'user' ? 'white' : theme.colors.text,
                  border: m.role === 'user' ? 'none' : `1px solid ${theme.colors.border}`,
                  boxShadow: theme.shadowLight,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: 12
              }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors.textSecondary
                }}>
                  <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
                    ● ● ●
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{ 
            color: theme.colors.error, 
            fontSize: 14,
            padding: '12px 16px',
            background: '#fee2e2',
            borderRadius: 8,
            border: `1px solid ${theme.colors.error}`
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Input area */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
            style={{ 
              flex: 1, 
              padding: '12px 14px', 
              borderRadius: 10, 
              border: `1px solid ${theme.colors.border}`, 
              outline: 'none',
              fontSize: 14,
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
              background: theme.colors.surface
            }}
            onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
            onBlur={(e) => e.target.style.borderColor = theme.colors.border}
          />
          <button
            onClick={onSend}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 24px', 
              borderRadius: 10, 
              border: 'none', 
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              background: loading || !input.trim() ? '#93c5fd' : theme.colors.primary, 
              color: 'white',
              boxShadow: theme.shadow, 
              transition: 'all 0.2s',
              fontWeight: 600,
              fontSize: 14,
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              if (!loading && input.trim()) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = theme.shadow;
            }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </main>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
