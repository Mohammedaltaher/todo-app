import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const { todos, isLoading } = useTodos();
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'dueDate'
  
  // Empty state illustration - simplified SVG for todo list
  const EmptyStateIllustration = () => (
    <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
      <rect x="40" y="20" width="120" height="140" rx="8" fill="#F3F4F6" />
      <rect x="60" y="50" width="80" height="10" rx="2" fill="#E5E7EB" />
      <rect x="60" y="70" width="80" height="10" rx="2" fill="#E5E7EB" />
      <rect x="60" y="90" width="40" height="10" rx="2" fill="#E5E7EB" />
      <circle cx="45" cy="55" r="5" fill="#D1D5DB" />
      <circle cx="45" cy="75" r="5" fill="#D1D5DB" />
      <circle cx="45" cy="95" r="5" fill="#D1D5DB" />
      <path d="M110 30C110 32.7614 107.761 35 105 35C102.239 35 100 32.7614 100 30C100 27.2386 102.239 25 105 25C107.761 25 110 27.2386 110 30Z" fill="#4F46E5" />
      <path d="M105 120L95 130H115L105 120Z" fill="#4F46E5" />
    </svg>
  );
  
  // Apply filters and sorting
  const getFilteredAndSortedTodos = () => {
    // First filter
    let filteredTodos = todos;
    
    if (filter === 'active') {
      filteredTodos = todos.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filteredTodos = todos.filter(todo => todo.completed);
    }
    
    // Then sort
    return filteredTodos.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      } else if (sortBy === 'dueDate') {
        // Sort by due date (todos without due dates go last)
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });
  };
  
  const filteredAndSortedTodos = getFilteredAndSortedTodos();
  
  // Filter and sort controls
  const FilterAndSortControls = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 bg-white rounded-lg p-3 border border-gray-200">
      <div className="flex space-x-1 mb-2 sm:mb-0" role="group" aria-label="Filter tasks">
        { [
          { id: 'all', label: 'All' },
          { id: 'active', label: 'Active' },
          { id: 'completed', label: 'Completed' }
        ].map((option) => (
          <button
            key={option.id}
            onClick={() => setFilter(option.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === option.id
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={filter === option.id}
            aria-label={option.label}
            data-testid={`filter-btn-${option.id}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      <div className="flex items-center">
        <label htmlFor="sortBy" className="text-sm text-gray-600 mr-2">Sort by:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm border border-gray-300 rounded-md py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-4">
        <FilterAndSortControls />
        <div className="space-y-3">
          <span>Loading...</span>
          <ul data-testid="todo-list" role="list" className="space-y-1">
            {[1, 2, 3].map((n) => (
              <li key={n} className="animate-pulse bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-md bg-gray-200"></div>
                  <div className="ml-3 flex-grow">
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Empty state
  if (todos.length === 0) {
    return (
      <div className="mt-4">
        <FilterAndSortControls />
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100 mt-4">
          <EmptyStateIllustration />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No tasks yet</h3>
          <p className="text-gray-500 mb-6">Time to be productive! Add your first task using the form above.</p>
          <button 
            className="btn-primary px-4 py-2"
            onClick={() => document.querySelector('form button[type="submit"]').focus()}
          >
            Add Your First Task
          </button>
          <ul data-testid="todo-list" role="list" className="hidden" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-4">
      <FilterAndSortControls />
      <ul data-testid="todo-list" className="space-y-1">
        {filteredAndSortedTodos.map((todo) => (
          <li key={todo.id}>
            <TodoItem todo={todo} />
          </li>
        ))}
      </ul>
      <div className="text-center mt-6 text-sm text-gray-500">
        {filter === 'all' && `Showing all ${filteredAndSortedTodos.length} tasks`}
        {filter === 'active' && `Showing ${filteredAndSortedTodos.length} active tasks`}
        {filter === 'completed' && `Showing ${filteredAndSortedTodos.length} completed tasks`}
      </div>
    </div>
  );
};

export default TodoList;
