import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, taskTitle, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content glass-panel confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-wrap">
          <AlertTriangle size={28} className="confirm-icon" />
        </div>

        <h3 className="confirm-title">Delete Task?</h3>
        <p className="confirm-message">
          Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>"{taskTitle}"</strong>?
          This action will permanently remove it from the database.
        </p>

        <div className="confirm-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
            id="confirm-delete-btn"
          >
            {isDeleting ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
