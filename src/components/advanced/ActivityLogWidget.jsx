// src/components/advanced/ActivityLogWidget.jsx
import React, { useState } from 'react';
import { useTodos } from '../../context/TodoContext';

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

// Helper to get action icon and color
const getActionMeta = (action) => {
  switch (action) {
    case 'create':
      return { 
        icon: <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>,
        color: 'text-green-500 bg-green-100'
      };
    case 'complete':
      return { 
        icon: <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>,
        color: 'text-blue-500 bg-blue-100'
      };
    case 'uncomplete':
      return { 
        icon: <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 8a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
        color: 'text-yellow-500 bg-yellow-100'
      };
    case 'update':
      return { 
        icon: <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>,
        color: 'text-indigo-500 bg-indigo-100'
      };
    case 'delete':
      return { 
        icon: <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
        color: 'text-red-500 bg-red-100'
      };
    case 'archive':
      return { 
        icon: <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
        color: 'text-purple-500 bg-purple-100'
      };
    default:
      return { 
        icon: <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 000-2H9z" clipRule="evenodd" /></svg>,
        color: 'text-gray-500 bg-gray-100'
      };
  }
};

const ActivityLogWidget = () => {
  const { getActivityLogs } = useTodos();
  const [filter, setFilter] = useState('all');
  
  // Get activity logs with the current filter
  const activityLog = getActivityLogs ? 
    getActivityLogs(filter !== 'all' ? { action: filter } : {}) : 
    [];
  
  if (!activityLog || activityLog.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          <button className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors">
            View All
          </button>
        </div>
        <div className="flex justify-center items-center py-8 text-gray-500">
          <svg className="h-10 w-10 mr-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No recent activity</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
        <button className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors">
          View All
        </button>
      </div>
      
      {/* Filter buttons */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {['all', 'create', 'complete', 'update', 'delete'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-2 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
              filter === type 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {activityLog.slice(0, 10).map((activity) => {
          const { icon, color } = getActionMeta(activity.action);
          
          return (
            <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 animate-fade-in">
              <div className={`${color} p-1.5 rounded-full flex-shrink-0`}>
                {icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm text-gray-800 truncate">
                    {activity.todoTitle || 'Unknown task'}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mt-0.5">
                  {activity.action === 'create' && 'Created new task'}
                  {activity.action === 'update' && 'Updated task details'}
                  {activity.action === 'complete' && 'Marked as completed'}
                  {activity.action === 'uncomplete' && 'Marked as not completed'}
                  {activity.action === 'delete' && 'Deleted task'}
                  {activity.action === 'archive' && 'Archived task'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityLogWidget;
