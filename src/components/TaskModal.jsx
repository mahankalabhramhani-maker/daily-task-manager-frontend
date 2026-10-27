import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(taskToEdit && taskToEdit.id);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate || '');
      setStatus(taskToEdit.status || 'PENDING');
    } else {
      setTitle('');
      setDescription('');
      // Default to today's date in YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      setDueDate(today);
      setStatus('PENDING');
    }
    setErrors({});
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Task title is required';
    } else if (title.trim().length > 150) {
      errs.title = 'Title cannot exceed 150 characters';
    }

    if (description && description.length > 1000) {
      errs.description = 'Description cannot exceed 1000 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || null,
        dueDate: dueDate || null,
        status: status,
      });
      onClose();
    } catch (err) {
      // Error is handled via toast in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper date buttons
  const setQuickDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setDueDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="btn-icon btn-ghost"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="task-title-input" className="form-label">
              Task Title <span className="required-star">*</span>
            </label>
            <input
              id="task-title-input"
              type="text"
              className={`form-input ${errors.title ? 'has-error' : ''}`}
              placeholder="e.g., Complete project documentation"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              autoFocus
            />
            {errors.title && (
              <div className="form-error">
                <AlertCircle size={14} />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Description Field */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label htmlFor="task-desc-input" className="form-label">Description (Optional)</label>
              <span className="char-counter">{description.length}/1000</span>
            </div>
            <textarea
              id="task-desc-input"
              className="form-textarea"
              placeholder="Add details, notes, or specific steps..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Due Date Field */}
          <div className="form-group">
            <label htmlFor="task-due-input" className="form-label">Due Date</label>
            <div className="due-date-input-row">
              <input
                id="task-due-input"
                type="date"
                className="form-input date-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <div className="quick-date-pills">
                <button
                  type="button"
                  className="quick-date-btn"
                  onClick={() => setQuickDate(0)}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="quick-date-btn"
                  onClick={() => setQuickDate(1)}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  className="quick-date-btn"
                  onClick={() => setQuickDate(7)}
                >
                  +1 Week
                </button>
              </div>
            </div>
          </div>

          {/* Status field (if editing) */}
          {isEditing && (
            <div className="form-group">
              <label htmlFor="task-status-select" className="form-label">Status</label>
              <select
                id="task-status-select"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          )}

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              id="submit-task-btn"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
