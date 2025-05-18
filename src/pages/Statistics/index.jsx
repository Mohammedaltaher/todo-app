// src/pages/Statistics/index.jsx
import { useState } from 'react';
import useGamification from '../../hooks/useGamification';
import ExportImport from '../../components/advanced/ExportImport';
import ActivityLog from '../../components/advanced/ActivityLog';
import * as Tabs from '@radix-ui/react-tabs';
import * as Avatar from '@radix-ui/react-avatar';
import * as Progress from '@radix-ui/react-progress';

const Statistics = () => {
  const [timePeriod, setTimePeriod] = useState('week');
  const { 
    getCurrentStreak, 
    getCompletionStats, 
    getProductivityPatterns,
    getUserLevel,
    getAchievements
  } = useGamification();
  
  // Get stats based on selected time period
  const stats = getCompletionStats(timePeriod);
  const streak = getCurrentStreak();
  const productivityPatterns = getProductivityPatterns();
  const userLevel = getUserLevel();
  const achievements = getAchievements();
  
  // Format day of week data for chart
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Statistics & Achievements</h1>
        <div className="flex space-x-2">
          <ActivityLog />
        </div>
      </div>
      
      {/* User Level */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-shrink-0">
            <Avatar.Root className="bg-[var(--color-primary)] inline-flex h-24 w-24 select-none items-center justify-center overflow-hidden rounded-full align-middle">
              <Avatar.Fallback className="text-white text-3xl font-medium">
                {userLevel.level}
              </Avatar.Fallback>
            </Avatar.Root>
          </div>
          
          <div className="flex-grow">
            <h2 className="text-xl font-semibold mb-1">Level {userLevel.level}</h2>
            <p className="text-gray-600 mb-3">
              You've completed {userLevel.completedTasks} tasks. 
              Complete {userLevel.tasksToNextLevel} more tasks to reach level {userLevel.level + 1}.
            </p>
            
            <div className="relative pt-1">
              <div className="mb-1 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-[var(--color-primary)]">
                    {Math.round(userLevel.progress)}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-gray-600">
                    {userLevel.completedTasks % 10}/{10} tasks
                  </span>
                </div>
              </div>
              <Progress.Root 
                className="h-2 w-full bg-gray-200 rounded-full overflow-hidden" 
                value={userLevel.progress}
              >
                <Progress.Indicator
                  className="h-full bg-[var(--color-primary)] transition-all duration-300 ease-out"
                  style={{ width: `${userLevel.progress}%` }}
                />
              </Progress.Root>
            </div>
          </div>
          
          <div className="flex-shrink-0 text-center">
            <div className="bg-amber-100 p-3 rounded-lg">
              <div className="text-3xl font-bold text-amber-600">{streak}</div>
              <div className="text-sm text-amber-800">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Completion Stats */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Completion Stats</h2>
          
          <div className="mb-4">
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-800 mb-1">Completed</div>
              <div className="text-2xl font-bold text-blue-900">{stats.completed} tasks</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-800 mb-1">Completion Rate</div>
              <div className="text-2xl font-bold text-green-900">{stats.completionRate}%</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-800 mb-1">Total</div>
              <div className="text-2xl font-bold text-purple-900">{stats.total} tasks</div>
            </div>
          </div>
        </div>
        
        {/* Productivity Patterns */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Productivity by Day</h2>
          
          <div className="space-y-3">
            {daysOfWeek.map(day => {
              const dayData = productivityPatterns[day] || { completed: 0, total: 0, completionRate: 0 };
              
              return (
                <div key={day} className="group">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>{day}</span>
                    <span className="text-gray-600">{dayData.completionRate}%</span>
                  </div>
                  <div className="bg-gray-200 h-4 w-full rounded-full overflow-hidden">
                    <div 
                      className="bg-[var(--color-primary)] h-full rounded-full transition-all group-hover:opacity-80"
                      style={{ width: `${dayData.completionRate}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {dayData.completed}/{dayData.total} tasks
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Achievements */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Achievements</h2>
          
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100"
              >
                <div className="bg-amber-200 p-2 rounded-full mr-3">
                  <svg className="h-5 w-5 text-amber-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">{achievement.name}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                </div>
              </div>
            ))}
            
            {achievements.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                Complete tasks to earn achievements!
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <ExportImport />
      </div>
    </div>
  );
};

export default Statistics;
