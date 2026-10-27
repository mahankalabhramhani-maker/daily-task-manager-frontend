import React, { useState, useEffect } from 'react';
import { CheckSquare, Moon, Sun, Plus } from 'lucide-react';

export default function Navbar({ theme, onToggleTheme, onOpenNewTaskModal }) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      setCurrentDate(now.toLocaleDateString(undefined, options));
    };
    updateTime();
  }, []);

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <CheckSquare className="brand-icon" size={24} />
          </div>
          <div>
            <h1 className="brand-title">Daily Task Manager</h1>
            <p className="brand-subtitle">Plan • Track • Accomplish</p>
          </div>
        </div>

        <div className="navbar-actions">
          <span className="navbar-date-badge">
            {currentDate}
          </span>

          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} className="theme-icon sun" /> : <Moon size={18} className="theme-icon moon" />}
          </button>

          <button
            onClick={onOpenNewTaskModal}
            className="btn btn-primary new-task-btn"
            id="create-task-btn"
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
