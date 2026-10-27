import React, { useState } from 'react';
import { Calendar, Edit3, Trash2, Check, Clock, AlertCircle } from 'lucide-react';

export default function TaskItem({ task, onToggleStatus, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCompleted = task.status === 'COMPLETED';

  // Format Due Date and determine overdue/due today status
  const getDueStatus = () => {
    if (!task.dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = task.dueDate.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0 && !isCompleted) {
      return { label: 'Overdue', className: 'overdue', icon: AlertCircle };
    } else if (diffDays === 0) {
      return { label: 'Due Today', className: 'today', icon: Clock };
    } else if (diffDays === 1) {
      return { label: 'Due Tomorrow', className: 'soon', icon: Clock };
    }
    return {
      label: dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      className: 'normal',
      icon: Calendar,
    };
  };

  const dueInfo = getDueStatus();
  const DueIcon = dueInfo ? dueInfo.icon : null;

  return (
    <article className={`task-card glass-panel ${isCompleted ? 'completed' : 'pending'}`}>
      <div className="task-card-main">
        {/* Checkbox button */}
        <button
          className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={() => onToggleStatus(task.id)}
          title={`Mark as ${isCompleted ? 'Pending' : 'Completed'}`}
          aria-label={`Toggle completion for ${task.title}`}
        >
          {isCompleted && <Check size={14} className="check-icon" />}
        </button>

        {/* Content */}
        <div className="task-body">
          <div className="task-header-row">
            <h3 className={`task-title ${isCompleted ? 'strikethrough' : ''}`}>
              {task.title}
            </h3>
            
            <div className="task-badges">
              <span className={`status-badge ${isCompleted ? 'completed' : 'pending'}`}>
                {task.status}
              </span>
            </div>
          </div>

          {task.description && (
            <p className={`task-description ${isExpanded ? 'expanded' : ''}`}>
              {task.description}
            </p>
          )}

          {task.description && task.description.length > 120 && (
            <button
              className="btn-text-expand"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}

          {/* Meta footer: Due date and action buttons */}
          <div className="task-footer">
            <div className="task-meta-left">
              {dueInfo && (
                <span className={`due-date-pill ${dueInfo.className}`}>
                  <DueIcon size={13} />
                  <span>{dueInfo.label}</span>
                </span>
              )}
            </div>

            <div className="task-actions">
              <button
                className="btn-action edit"
                onClick={() => onEdit(task)}
                title="Edit task"
                aria-label="Edit task"
              >
                <Edit3 size={15} />
              </button>
              <button
                className="btn-action delete"
                onClick={() => onDelete(task)}
                title="Delete task"
                aria-label="Delete task"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
