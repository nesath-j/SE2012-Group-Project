import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '420px',
      width: 'calc(100% - 48px)'
    }}>
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const borderColor = isSuccess ? 'rgba(16, 185, 129, 0.4)' : isError ? 'rgba(244, 63, 94, 0.4)' : 'rgba(14, 165, 233, 0.4)';
        const bgColor = isSuccess ? 'rgba(6, 44, 30, 0.95)' : isError ? 'rgba(48, 14, 25, 0.95)' : 'rgba(12, 30, 56, 0.95)';

        return (
          <div
            key={toast.id}
            style={{
              background: bgColor,
              border: `1px solid ${borderColor}`,
              backdropFilter: 'blur(12px)',
              borderRadius: '12px',
              padding: '14px 16px',
              color: '#f8fafc',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>
              {isSuccess && <CheckCircle2 size={18} color="#34d399" />}
              {isError && <AlertCircle size={18} color="#fb7185" />}
              {!isSuccess && !isError && <Info size={18} color="#38bdf8" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title && <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{toast.title}</div>}
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.4' }}>{toast.message}</div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                color: '#94a3b8',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px'
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
