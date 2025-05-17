import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import Button from '../components/Button';
import { SettingsIcon } from '../assets/icons/IconComponent';

const SettingsPage = () => {
  const { todos } = useTodos();
  const [theme, setTheme] = useState('light');
  
  // Count completed tasks
  const completedTasks = todos.filter(todo => todo.completed).length;
  // Calculate completion percentage
  const completionPercentage = todos.length > 0 
    ? Math.round((completedTasks / todos.length) * 100) 
    : 0;
    
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.className = newTheme;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <SettingsIcon className="h-6 w-6 mr-2 text-[var(--color-primary)]" />
        Settings
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => handleThemeChange('light')}
            className={`${theme === 'light' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100'}`}
          >
            Light
          </Button>
          <Button 
            onClick={() => handleThemeChange('dark')}
            className={`${theme === 'dark' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100'}`}
          >
            Dark
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
        <div className="mb-4">
          <p className="text-gray-600 mb-2">Total tasks: {todos.length}</p>
          <p className="text-gray-600 mb-2">Completed tasks: {completedTasks}</p>
          <p className="text-gray-600 mb-4">Completion rate: {completionPercentage}%</p>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-[var(--color-primary)] h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <p className="text-gray-600 mb-2">Todo App v1.0.0</p>
        <p className="text-gray-600">A simple todo app to manage your tasks efficiently.</p>
      </div>
    </div>

    
  );
};

export default SettingsPage;
