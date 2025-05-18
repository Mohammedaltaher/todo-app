// src/hooks/useCalendar.jsx
import { useState, useCallback } from 'react';
import { useTodos } from '../context/TodoContext';

/**
 * Custom hook for calendar functionality
 */
const useCalendar = () => {
  const { todos } = useTodos();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  
  /**
   * Get todos for a specific date
   * @param {Date} date - The date to get todos for
   * @returns {Array} - Array of todos for the specified date
   */
  const getTodosForDate = useCallback((date) => {
    // Format date to YYYY-MM-DD
    const dateString = date.toISOString().split('T')[0];
    
    return todos.filter(todo => {
      // If the todo has a due date, check if it matches
      if (todo.dueDate) {
        const todoDueDate = new Date(todo.dueDate).toISOString().split('T')[0];
        return todoDueDate === dateString;
      }
      return false;
    });
  }, [todos]);
  
  /**
   * Get todos for selected date
   * @returns {Array} - Array of todos for the selected date
   */
  const getSelectedDateTodos = useCallback(() => {
    return getTodosForDate(selectedDate);
  }, [selectedDate, getTodosForDate]);
  
  /**
   * Get todos for a date range
   * @param {Date} startDate - Start of the range
   * @param {Date} endDate - End of the range
   * @returns {Object} - Object with dates as keys and arrays of todos as values
   */
  const getTodosForDateRange = useCallback((startDate, endDate) => {
    const result = {};
    const currentDate = new Date(startDate);
    
    // Iterate over each day in the range
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      result[dateString] = getTodosForDate(new Date(currentDate));
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return result;
  }, [getTodosForDate]);
  
  /**
   * Get todos for the current month
   * @returns {Object} - Object with dates as keys and arrays of todos as values
   */
  const getMonthTodos = useCallback(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    return getTodosForDateRange(firstDay, lastDay);
  }, [selectedDate, getTodosForDateRange]);
  
  /**
   * Get todos for the current week
   * @returns {Object} - Object with dates as keys and arrays of todos as values
   */
  const getWeekTodos = useCallback(() => {
    const currentDate = new Date(selectedDate);
    const day = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Calculate first day of the week (Sunday)
    const firstDay = new Date(currentDate);
    firstDay.setDate(currentDate.getDate() - day);
    
    // Calculate last day of the week (Saturday)
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    
    return getTodosForDateRange(firstDay, lastDay);
  }, [selectedDate, getTodosForDateRange]);
  
  /**
   * Check if a date has any todos
   * @param {Date} date - The date to check
   * @returns {boolean} - True if the date has todos
   */
  const hasTasksOnDate = useCallback((date) => {
    return getTodosForDate(date).length > 0;
  }, [getTodosForDate]);
  
  /**
   * Get tile content for calendar
   * @param {Date} date - The date for the tile
   * @returns {JSX.Element|null} - Element to render in the tile or null
   */
  const getTileContent = useCallback(({ date }) => {
    const tasksForDate = getTodosForDate(date);
    
    if (tasksForDate.length > 0) {
      return (
        <div className="task-indicator">
          <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
        </div>
      );
    }
    
    return null;
  }, [getTodosForDate]);
  
  /**
   * Get tile class name based on tasks
   * @param {Object} param0 - Object containing date
   * @returns {string} - CSS class names
   */
  const getTileClassName = useCallback(({ date }) => {
    const classes = [];
    
    // Add class if there are tasks on this date
    if (hasTasksOnDate(date)) {
      classes.push('has-tasks');
    }
    
    return classes.join(' ');
  }, [hasTasksOnDate]);
  
  return {
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    getTodosForDate,
    getSelectedDateTodos,
    getTodosForDateRange,
    getMonthTodos,
    getWeekTodos,
    hasTasksOnDate,
    getTileContent,
    getTileClassName
  };
};

export default useCalendar;
