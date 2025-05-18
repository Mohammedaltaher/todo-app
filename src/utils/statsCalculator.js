// src/utils/statsCalculator.js
/**
 * Calculate statistics about completed todos
 * @param {Array} todos - Array of todo objects
 * @param {string} period - Time period for stats ('day', 'week', 'month', 'year')
 * @returns {Object} Statistics object
 */
export const calculateCompletionStats = (todos, period = 'week') => {
  if (!todos || !todos.length) {
    return {
      completed: 0,
      total: 0, 
      completionRate: 0,
      streak: 0
    };
  }
  
  // Get date boundaries for the specified period
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      // Start from Sunday of the current week
      const day = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - day);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7); // Default to last 7 days
  }
  
  // Filter todos for the current period
  const periodTodos = todos.filter(todo => {
    const updatedAt = new Date(todo.updatedAt);
    return updatedAt >= startDate && updatedAt <= now;
  });
  
  // Count completed todos in the period
  const completedTodos = periodTodos.filter(todo => todo.completed);
  
  // Calculate completion rate
  const completionRate = periodTodos.length > 0 
    ? Math.round((completedTodos.length / periodTodos.length) * 100) 
    : 0;
  
  // Calculate streak (consecutive days with completed todos)
  const streak = calculateStreak(todos);
  
  return {
    completed: completedTodos.length,
    total: periodTodos.length,
    completionRate,
    streak
  };
};

/**
 * Calculate current streak of consecutive days with completed todos
 * @param {Array} todos - Array of todo objects
 * @returns {number} Current streak in days
 */
export const calculateStreak = (todos) => {
  if (!todos || todos.length === 0) return 0;
  
  // Get all completion dates
  const completionDates = todos
    .filter(todo => todo.completed)
    .map(todo => {
      // Use the updated date as completion date
      const date = new Date(todo.updatedAt);
      // Reset time part to compare dates only
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
    });
  
  if (completionDates.length === 0) return 0;
  
  // Get unique dates
  const uniqueDates = [...new Set(completionDates)].sort();
  
  // Get today's date (without time)
  const today = new Date();
  const todayString = new Date(
    today.getFullYear(), 
    today.getMonth(), 
    today.getDate()
  ).toISOString();
  
  let currentStreak = 0;
  
  // Check if today has completed todos
  if (uniqueDates.includes(todayString)) {
    currentStreak = 1;
    
    // Check previous consecutive days
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);
    
    while (true) {
      const checkDateString = new Date(
        checkDate.getFullYear(),
        checkDate.getMonth(),
        checkDate.getDate()
      ).toISOString();
      
      if (uniqueDates.includes(checkDateString)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  } else {
    // Check if yesterday has completed todos
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    ).toISOString();
    
    if (uniqueDates.includes(yesterdayString)) {
      currentStreak = 1;
      
      // Check previous consecutive days
      let checkDate = new Date(yesterday);
      checkDate.setDate(checkDate.getDate() - 1);
      
      while (true) {
        const checkDateString = new Date(
          checkDate.getFullYear(),
          checkDate.getMonth(),
          checkDate.getDate()
        ).toISOString();
        
        if (uniqueDates.includes(checkDateString)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }
  
  return currentStreak;
};

/**
 * Get productivity data by day of week
 * @param {Array} todos - Array of todo objects
 * @param {number} weeks - Number of weeks to analyze
 * @returns {Object} Data by day of week
 */
export const getProductivityByDayOfWeek = (todos, weeks = 4) => {
  if (!todos || todos.length === 0) return {};
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const result = {};
  
  // Initialize result object
  dayNames.forEach(day => {
    result[day] = {
      completed: 0,
      total: 0,
      completionRate: 0
    };
  });
  
  // Calculate cutoff date (n weeks ago)
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - (weeks * 7));
  
  // Filter todos for the specified period
  const recentTodos = todos.filter(todo => new Date(todo.updatedAt) >= cutoffDate);
  
  // Group by day of week
  recentTodos.forEach(todo => {
    const updatedAt = new Date(todo.updatedAt);
    const dayName = dayNames[updatedAt.getDay()];
    
    result[dayName].total++;
    if (todo.completed) {
      result[dayName].completed++;
    }
  });
  
  // Calculate completion rates
  Object.keys(result).forEach(day => {
    const { completed, total } = result[day];
    result[day].completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  });
  
  return result;
};
