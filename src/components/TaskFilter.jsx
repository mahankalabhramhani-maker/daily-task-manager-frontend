import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function TaskFilter({
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  counts,
}) {
  const { total = 0, pending = 0, completed = 0 } = counts || {};

  return (
    <div className="filter-controls-container glass-panel">
      {/* Filter Tabs */}
      <div className="filter-tabs" role="tablist">
        <button
          className={`filter-tab ${activeFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => onFilterChange('ALL')}
          id="filter-all-btn"
        >
          <span>All Tasks</span>
          <span className="tab-counter">{total}</span>
        </button>

        <button
          className={`filter-tab pending ${activeFilter === 'PENDING' ? 'active' : ''}`}
          onClick={() => onFilterChange('PENDING')}
          id="filter-pending-btn"
        >
          <span>Pending</span>
          <span className="tab-counter">{pending}</span>
        </button>

        <button
          className={`filter-tab completed ${activeFilter === 'COMPLETED' ? 'active' : ''}`}
          onClick={() => onFilterChange('COMPLETED')}
          id="filter-completed-btn"
        >
          <span>Completed</span>
          <span className="tab-counter">{completed}</span>
        </button>
      </div>

      {/* Search & Sort Controls */}
      <div className="search-sort-group">
        {/* Search Bar */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            id="search-tasks-input"
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="sort-select-wrapper">
          <SlidersHorizontal size={15} className="sort-icon" />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            id="sort-tasks-select"
          >
            <option value="due-asc">Due Date (Earliest)</option>
            <option value="due-desc">Due Date (Latest)</option>
            <option value="title-asc">Title (A - Z)</option>
            <option value="created-desc">Recently Added</option>
          </select>
        </div>
      </div>
    </div>
  );
}
