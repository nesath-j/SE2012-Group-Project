import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';


  return (
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>
              {!isSuccess && !isError && <Info size={18} color="#38bdf8" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              </div>
            <button
              style={{
                padding: '2px',
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
