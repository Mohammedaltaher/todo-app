// src/utils/dateUtils.js
/**
 * Utility functions for date handling in the Todo app
 */

/**
 * Format a date string to a human-readable format
 * @param {string} dateString - ISO date string
 * @param {object} options - Formatting options for toLocaleDateString
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return null;
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  return new Date(dateString).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Calculate days remaining until a due date
 * @param {string} dueDate - ISO date string for the due date
 * @returns {number|null} Number of days remaining, or null if no due date
 */
export const getDaysRemaining = (dueDate) => {
  if (!dueDate) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDateObj = new Date(dueDate);
  dueDateObj.setHours(0, 0, 0, 0);
  
  const diffTime = dueDateObj - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Check if a task is recurring and if it's due today
 * @param {object} todo - Todo object with recurrence info
 * @returns {boolean} True if task should be active today
 */
export const isRecurringTaskDueToday = (todo) => {
  if (!todo.isRecurring || !todo.recurrencePattern) return false;
  
  const today = new Date();
  const pattern = todo.recurrencePattern;
  
  switch (pattern.type) {
    case 'daily':
      return true;
      
    case 'weekly':
      // Check if today's day of week is in the selected days
      return pattern.daysOfWeek.includes(today.getDay());
      
    case 'monthly':
      // Check if today's date matches the day of month
      return today.getDate() === pattern.dayOfMonth;
      
    case 'yearly':
      // Check if today's month and date match
      return today.getDate() === pattern.day && today.getMonth() === pattern.month - 1;
      
    default:
      return false;
  }
};

/**
 * Get the next occurrence of a recurring task
 * @param {object} todo - Todo object with recurrence info
 * @returns {Date|null} Date of next occurrence or null if not recurring
 */
export const getNextOccurrence = (todo) => {
  if (!todo.isRecurring || !todo.recurrencePattern) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const pattern = todo.recurrencePattern;
  let nextDate = new Date(today);
  
  switch (pattern.type) {
    case 'daily':
      // If today's instance hasn't been completed, return today
      if (!todo.completedInstances?.includes(today.toISOString().split('T')[0])) {
        return today;
      }
      // Otherwise, next occurrence is tomorrow
      nextDate.setDate(today.getDate() + 1);
      return nextDate;
      
    case 'weekly': {
      // Find the next day of week that's in the recurrence pattern
      const todayDayOfWeek = today.getDay();
      const selectedDays = pattern.daysOfWeek.sort((a, b) => a - b);
      
      // If today is a selected day and hasn't been completed
      if (selectedDays.includes(todayDayOfWeek) && 
          !todo.completedInstances?.includes(today.toISOString().split('T')[0])) {
        return today;
      }
      
      // Find the next day in the pattern
      const nextDays = selectedDays.filter(day => day > todayDayOfWeek);
      if (nextDays.length > 0) {
        // There's a day later this week
        nextDate.setDate(today.getDate() + (nextDays[0] - todayDayOfWeek));
      } else {
        // The next occurrence is in the following week
        nextDate.setDate(today.getDate() + (7 - todayDayOfWeek) + selectedDays[0]);
      }
      return nextDate;
    }
      
    case 'monthly': {
      const dayOfMonth = pattern.dayOfMonth;
      // If today is the day and hasn't been completed
      if (today.getDate() === dayOfMonth && 
          !todo.completedInstances?.includes(today.toISOString().split('T')[0])) {
        return today;
      }
      
      // Set to this month's occurrence
      nextDate.setDate(dayOfMonth);
      // If this month's occurrence is in the past, move to next month
      if (nextDate < today) {
        nextDate.setMonth(today.getMonth() + 1);
      }
      return nextDate;
    }
      
    default:
      return null;
  }
};

/**
 * Get a human-readable description of a recurrence pattern
 * @param {object} recurrencePattern - The recurrence pattern object
 * @returns {string} Human-readable description of the recurrence pattern
 */
export const getRecurrenceDescription = (recurrencePattern) => {
  if (!recurrencePattern) return 'Not recurring';
  
  const { type, interval = 1, daysOfWeek, dayOfMonth } = recurrencePattern;
  
  switch (type) {
    case 'daily':
      return interval === 1 ? 'Daily' : `Every ${interval} days`;
      
    case 'weekly':
      if (!daysOfWeek || daysOfWeek.length === 0) return 'Weekly';
      
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const selectedDays = daysOfWeek.map(day => dayNames[day]).join(', ');
      
      return `Weekly on ${selectedDays}`;
      
    case 'monthly':
      if (!dayOfMonth) return 'Monthly';
      
      // Add appropriate suffix to day number
      const getDaySuffix = (day) => {
        if (day >= 11 && day <= 13) return `${day}th`;
        
        switch (day % 10) {
          case 1: return `${day}st`;
          case 2: return `${day}nd`;
          case 3: return `${day}rd`;
          default: return `${day}th`;
        }
      };
      
      return `Monthly on the ${getDaySuffix(dayOfMonth)}`;
      
    case 'yearly':
      return 'Yearly';
      
    default:
      return 'Custom recurrence';
  }
};
