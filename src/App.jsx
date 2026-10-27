import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import TaskStats from './components/TaskStats';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import ConfirmModal from './components/ConfirmModal';
import NotificationToast from './components/NotificationToast';
import taskService from './api/taskService';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, completionRate: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Filters and sorting
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('due-asc');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notifications
  const [toast, setToast] = useState(null);

  // Theme state: dark / light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dtm_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dtm_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load stats from backend
  const loadStats = useCallback(async () => {
    try {
      const res = await taskService.getStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load task statistics:', err);
    }
  }, []);

  // Load tasks from backend
  const loadTasks = useCallback(async (filter = activeFilter, search = searchTerm) => {
    setIsLoading(true);
    try {
      const res = await taskService.getAll(filter, search);
      if (res && res.data) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      showToast('Could not connect to task server. Please ensure backend is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, searchTerm, showToast]);

  // Initial load
  useEffect(() => {
    loadTasks(activeFilter, searchTerm);
    loadStats();
  }, [activeFilter, searchTerm, loadTasks, loadStats]);

  // Handle Create or Update
  const handleSaveTask = async (taskData) => {
    try {
      if (taskToEdit && taskToEdit.id) {
        const res = await taskService.update(taskToEdit.id, taskData);
        showToast(res.message || 'Task updated successfully!', 'success');
      } else {
        const res = await taskService.create(taskData);
        showToast(res.message || 'Task added successfully!', 'success');
      }
      setIsTaskModalOpen(false);
      setTaskToEdit(null);
      await loadTasks();
      await loadStats();
    } catch (err) {
      showToast(err.message || 'Failed to save task', 'error');
      throw err;
    }
  };

  // Handle Toggle Status (Pending <-> Completed)
  const handleToggleStatus = async (taskId) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' }
          : t
      )
    );

    try {
      const res = await taskService.toggleStatus(taskId);
      showToast(res.message || 'Task status updated!', 'success');
      await loadStats();
    } catch (err) {
      showToast('Failed to update status', 'error');
      // Revert if error
      await loadTasks();
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (task) => {
    setTaskToDelete(task);
    setIsConfirmModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      const res = await taskService.delete(taskToDelete.id);
      showToast(res.message || 'Task deleted successfully', 'success');
      setIsConfirmModalOpen(false);
      setTaskToDelete(null);
      await loadTasks();
      await loadStats();
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Client-side sorting on retrieved tasks
  const sortedTasks = useMemo(() => {
    const list = [...tasks];
    list.sort((a, b) => {
      if (sortBy === 'due-asc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy === 'due-desc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return b.dueDate.localeCompare(a.dueDate);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'created-desc') {
        return (b.id || 0) - (a.id || 0);
      }
      return 0;
    });
    return list;
  }, [tasks, sortBy]);

  return (
    <div className="app-container">
      {/* Toast Notification */}
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      {/* Navigation Header */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenNewTaskModal={() => {
          setTaskToEdit(null);
          setIsTaskModalOpen(true);
        }}
      />

      {/* Main Dashboard Content */}
      <main className="main-content">
        {/* Metric Cards & Progress */}
        <TaskStats stats={stats} />

        {/* Filter Tabs, Search & Sort */}
        <TaskFilter
          activeFilter={activeFilter}
          onFilterChange={(filter) => setActiveFilter(filter)}
          searchTerm={searchTerm}
          onSearchChange={(search) => setSearchTerm(search)}
          sortBy={sortBy}
          onSortChange={(sort) => setSortBy(sort)}
          counts={stats}
        />

        {/* Task List Grid */}
        <TaskList
          tasks={sortedTasks}
          isLoading={isLoading}
          onToggleStatus={handleToggleStatus}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onOpenNewTaskModal={() => {
            setTaskToEdit(null);
            setIsTaskModalOpen(true);
          }}
          activeFilter={activeFilter}
        />
      </main>

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Task Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete ? taskToDelete.title : ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}
