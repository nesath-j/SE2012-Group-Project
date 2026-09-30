import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        pointerEvents: 'none'
      }}
    >
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 16px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.4)' : isError ? 'rgba(244, 63, 94, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(12px)',
              color: '#ffffff',
              animation: 'fadeIn 0.25s ease-out'
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>
              {isSuccess && <CheckCircle2 size={18} color="#10b981" />}
              {isError && <AlertCircle size={18} color="#f43f5e" />}
              {!isSuccess && !isError && <Info size={18} color="#38bdf8" />}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title && (
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '2px' }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', wordBreak: 'break-word' }}>
                {toast.message}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex'
              }}
              aria-label="Dismiss toast"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
