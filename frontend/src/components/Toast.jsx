import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type || 'info'}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} color="var(--success)" />
          ) : (
            <AlertCircle size={18} color="var(--danger)" />
          )}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            className="btn-ghost-icon"
            onClick={() => onDismiss(toast.id)}
            style={{ padding: '2px' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

