// src/components/advanced/ActivityLogWidget.jsx
import React from 'react';
import { useTodos } from '../../context/TodoContext';
import { formatDate } from '../../utils/dateUtils';

const ActivityLogWidget = () => {
  const { activityLog } = useTodos();
  
  if (!activityLog || activityLog.length === 0) {
    return (
      <div className="card p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <p className="text-gray-500 text-center">No recent activity.</p>
      </div>
    );
  }
  
  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="activity-log">
        {activityLog.slice(0, 10).map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="flex justify-between items-start">
              <span className="activity-action">{activity.action}</span>
              <span className="activity-timestamp">{formatDate(activity.timestamp, { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">{activity.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogWidget;
