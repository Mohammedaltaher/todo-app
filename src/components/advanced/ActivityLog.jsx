// src/components/advanced/ActivityLog.jsx
import { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import * as Sheet from '@radix-ui/react-dialog';

const ActivityLog = () => {
  const { getActivityLogs } = useTodos();
  const [filter, setFilter] = useState({
    action: '',
    dateFrom: '',
    dateTo: ''
  });
  const [isOpen, setIsOpen] = useState(false);
  
  // Get filtered logs
  const logs = getActivityLogs(filter);
  
  // Reset filters
  const resetFilters = () => {
    setFilter({
      action: '',
      dateFrom: '',
      dateTo: ''
    });
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get action icon and color
  const getActionInfo = (action) => {
    switch (action) {
      case 'create':
        return { 
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ), 
          color: 'text-green-600 bg-green-100' 
        };
      case 'update':
        return { 
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          ), 
          color: 'text-blue-600 bg-blue-100' 
        };
      case 'delete':
        return { 
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ), 
          color: 'text-red-600 bg-red-100' 
        };
      case 'complete':
        return { 
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ), 
          color: 'text-green-600 bg-green-100' 
        };
      case 'uncomplete':
        return { 
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ), 
          color: 'text-orange-600 bg-orange-100' 
        };
      case 'archive':
        return { 
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          ), 
          color: 'text-purple-600 bg-purple-100' 
        };
      case 'import':
        return { 
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ), 
          color: 'text-indigo-600 bg-indigo-100' 
        };
      default:
        return { 
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          ), 
          color: 'text-gray-600 bg-gray-100' 
        };
    }
  };
  
  // Format action name
  const formatActionName = (action) => {
    switch (action) {
      case 'create':
        return 'Created';
      case 'update':
        return 'Updated';
      case 'delete':
        return 'Deleted';
      case 'complete':
        return 'Completed';
      case 'uncomplete':
        return 'Uncompleted';
      case 'archive':
        return 'Archived';
      case 'import':
        return 'Imported';
      default:
        return action;
    }
  };
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Activity Log
      </button>
      
      <Sheet.Root open={isOpen} onOpenChange={setIsOpen}>
        <Sheet.Portal>
          <Sheet.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Sheet.Content className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 overflow-auto p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <Sheet.Title className="text-xl font-semibold">Activity Log</Sheet.Title>
              <Sheet.Close className="rounded-full p-1 hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Sheet.Close>
            </div>
            
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Action Type</label>
                <select
                  value={filter.action}
                  onChange={(e) => setFilter({...filter, action: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                >
                  <option value="">All Actions</option>
                  <option value="create">Created</option>
                  <option value="update">Updated</option>
                  <option value="delete">Deleted</option>
                  <option value="complete">Completed</option>
                  <option value="uncomplete">Uncompleted</option>
                  <option value="archive">Archived</option>
                  <option value="import">Imported</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">From Date</label>
                  <input
                    type="date"
                    value={filter.dateFrom}
                    onChange={(e) => setFilter({...filter, dateFrom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">To Date</label>
                  <input
                    type="date"
                    value={filter.dateTo}
                    onChange={(e) => setFilter({...filter, dateTo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Reset Filters
                </button>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              {logs.length > 0 ? (
                logs.map(log => {
                  const { icon, color } = getActionInfo(log.action);
                  
                  return (
                    <div key={log.id} className="border-b pb-3">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${color}`}>
                          {icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {formatActionName(log.action)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(log.timestamp)}
                            </span>
                          </div>
                          
                          <div className="text-sm mt-1">{log.todoTitle}</div>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            {log.details.priority && (
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                {log.details.priority}
                              </span>
                            )}
                            
                            {log.details.dueDate && (
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                Due: {new Date(log.details.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            
                            {log.details.completed !== undefined && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                log.details.completed 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {log.details.completed ? 'Completed' : 'Incomplete'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No activity logs found.
                </div>
              )}
            </div>
          </Sheet.Content>
        </Sheet.Portal>
      </Sheet.Root>
    </>
  );
};

export default ActivityLog;
