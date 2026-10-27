import React from 'react';
import { ListTodo, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

export default function TaskStats({ stats }) {
  const { total = 0, pending = 0, completed = 0, completionRate = 0 } = stats || {};

  return (
    <section className="stats-section">
      <div className="stats-grid">
        {/* Total Tasks */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrap total">
            <ListTodo size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{total}</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrap pending">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{pending}</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrap completed">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completed}</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="stat-card glass-panel rate-card">
          <div className="stat-icon-wrap rate">
            <TrendingUp size={22} />
          </div>
          <div className="stat-info" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label">Progress</span>
              <span className="stat-value" style={{ fontSize: '1.25rem' }}>{completionRate}%</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(completionRate, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
