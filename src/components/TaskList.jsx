import React from 'react';
import TaskItem from './TaskItem';
import { ClipboardList, PlusCircle, Sparkles } from 'lucide-react';

export default function TaskList({
  tasks,
  isLoading,
  onToggleStatus,
  onEdit,
  onDelete,
  onOpenNewTaskModal,
  activeFilter,
}) {
  if (isLoading) {
    return (
      <div className="task-list-loading">
        {[1, 2, 3].map((n) => (
          <div key={n} className="task-skeleton glass-panel">
            <div className="skeleton-checkbox shimmer"></div>
            <div className="skeleton-content">
              <div className="skeleton-line shimmer title"></div>
              <div className="skeleton-line shimmer desc"></div>
              <div className="skeleton-line shimmer meta"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state glass-panel animate-fade-in">
        <div className="empty-icon-wrap">
          <ClipboardList size={48} className="empty-icon" />
        </div>
        <h3 className="empty-title">
          {activeFilter === 'COMPLETED'
            ? 'No completed tasks yet'
            : activeFilter === 'PENDING'
            ? 'No pending tasks right now!'
            : 'No tasks found'}
        </h3>
        <p className="empty-subtitle">
          {activeFilter === 'COMPLETED'
            ? 'Complete your pending activities to see them recorded here.'
            : activeFilter === 'PENDING'
            ? 'You are all caught up! Great job staying on top of your work.'
            : 'Get started by creating your first daily task to stay organized.'}
        </p>
        <button
          className="btn btn-primary"
          onClick={onOpenNewTaskModal}
          style={{ marginTop: '16px' }}
        >
          <PlusCircle size={18} />
          <span>Add Your First Task</span>
        </button>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-grid">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleStatus={onToggleStatus}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
