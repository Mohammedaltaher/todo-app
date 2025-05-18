// filepath: c:\Users\DMA\source\repos\Vibe1\todo-app\src\pages\HomePage.jsx
import React from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import ActivityLogWidget from '../components/advanced/ActivityLogWidget';
import PomodoroTimer from '../components/advanced/PomodoroTimer';
import { TaskIcon } from '../assets/icons/IconComponent';

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TodoForm />
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <TaskIcon className="h-5 w-5 mr-2 text-[var(--color-primary)]" />
              My Tasks
            </h2>
            <TodoList />
          </div>
        </div>
        
        <div className="space-y-6">
          <PomodoroTimer />
          <ActivityLogWidget />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
