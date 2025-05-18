// src/pages/Calendar/index.jsx
import React from 'react';
import CalendarView from '../../components/advanced/CalendarView';
import PomodoroTimer from '../../components/advanced/PomodoroTimer';
import ActivityLog from '../../components/advanced/ActivityLog';

const CalendarPage = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar View</h1>
        <div className="flex space-x-2">
          <ActivityLog />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarView />
        </div>
        
        <div>
          <div className="sticky top-6">
            <div className="mb-6">
              <PomodoroTimer />
            </div>
            
            <div className="bg-white rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-2">Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[var(--color-primary)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Click on a date to see tasks due on that day.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[var(--color-primary)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Switch between month, week and day views.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[var(--color-primary)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Use the Pomodoro timer to stay focused on tasks.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-[var(--color-primary)] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Days with tasks are highlighted with a dot.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
