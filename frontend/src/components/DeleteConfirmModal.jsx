import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, customer }) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !customer) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm(customer.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={22} color="var(--danger)" />
            <h2 className="modal-title">Delete Customer</h2>
          </div>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Are you sure you want to delete{' '}
            <strong>
              {customer.firstName} {customer.lastName}
            </strong>
            ? This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 size={16} className="spin" />
                Deleting...
              </>
            ) : (
              'Confirm Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

