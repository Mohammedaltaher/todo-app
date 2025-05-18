// src/hooks/useGamification.js
import { useCallback } from 'react';
import { useTodos } from '../context/TodoContext';
import { calculateCompletionStats, getProductivityByDayOfWeek } from '../utils/statsCalculator';

/**
 * Custom hook for gamification features
 */
const useGamification = () => {
  const { todos } = useTodos();
  
  /**
   * Get user's current streak
   * @returns {number} - Current streak in days
   */
  const getCurrentStreak = useCallback(() => {
    const stats = calculateCompletionStats(todos);
    return stats.streak;
  }, [todos]);
  
  /**
   * Get completion stats for a specific period
   * @param {string} period - Time period ('day', 'week', 'month', 'year')
   * @returns {Object} - Stats object
   */
  const getCompletionStats = useCallback((period = 'week') => {
    return calculateCompletionStats(todos, period);
  }, [todos]);
  
  /**
   * Get productivity patterns by day of week
   * @param {number} weeks - Number of weeks to analyze
   * @returns {Object} - Data by day of week
   */
  const getProductivityPatterns = useCallback((weeks = 4) => {
    return getProductivityByDayOfWeek(todos, weeks);
  }, [todos]);
  
  /**
   * Get user level based on tasks completed
   * @returns {Object} - User level info
   */
  const getUserLevel = useCallback(() => {
    const completedTasks = todos.filter(todo => todo.completed).length;
    
    // Level calculation logic
    const level = Math.floor(completedTasks / 10) + 1;
    const nextLevelTasks = level * 10;
    const progress = ((completedTasks % 10) / 10) * 100;
    
    return {
      level,
      completedTasks,
      nextLevelTasks,
      tasksToNextLevel: nextLevelTasks - completedTasks,
      progress
    };
  }, [todos]);
  
  /**
   * Get achievement badges earned by the user
   * @returns {Array} - Array of badges earned
   */
  const getAchievements = useCallback(() => {
    const completedTasks = todos.filter(todo => todo.completed).length;
    const highPriorityCompleted = todos.filter(todo => todo.completed && todo.priority === 'high').length;
    const streak = getCurrentStreak();
    
    const achievements = [];
    
    // Task completion achievements
    if (completedTasks >= 1) achievements.push({ id: 'first-task', name: 'First Steps', description: 'Complete your first task' });
    if (completedTasks >= 10) achievements.push({ id: '10-tasks', name: 'Getting Things Done', description: 'Complete 10 tasks' });
    if (completedTasks >= 50) achievements.push({ id: '50-tasks', name: 'Productivity Master', description: 'Complete 50 tasks' });
    if (completedTasks >= 100) achievements.push({ id: '100-tasks', name: 'Task Centurion', description: 'Complete 100 tasks' });
    
    // Priority achievements
    if (highPriorityCompleted >= 10) achievements.push({ id: 'high-priority', name: 'Firefighter', description: 'Complete 10 high-priority tasks' });
    
    // Streak achievements
    if (streak >= 3) achievements.push({ id: 'streak-3', name: 'Consistency', description: 'Maintain a 3-day streak' });
    if (streak >= 7) achievements.push({ id: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day streak' });
    if (streak >= 30) achievements.push({ id: 'streak-30', name: 'Monthly Master', description: 'Maintain a 30-day streak' });
    
    return achievements;
  }, [todos, getCurrentStreak]);
  
  return {
    getCurrentStreak,
    getCompletionStats,
    getProductivityPatterns,
    getUserLevel,
    getAchievements
  };
};

export default useGamification;
