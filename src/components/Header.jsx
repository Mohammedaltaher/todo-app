import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';

const Header = () => {
  const { todos } = useTodos();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Calculate task stats
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  // Get current date
  const today = new Date();
  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);
  
  // Random greeting messages
  const greetings = [
    "Let's get things done!",
    "Ready to be productive?",
    "What's on your plate today?",
    "Plan your day for success!",
    "Focus on what matters today."
  ];
  
  // Get a random greeting
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Generate user initials (placeholder)
  const userInitials = "JD";

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 py-4 px-6 shadow-sm sticky top-0 z-40">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-1 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Task Master</h1>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:block">
            <p className="text-md font-medium text-gray-700">{randomGreeting}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-indigo-700">{pendingTasks} pending</span>
            </div>
            <div className="bg-purple-100 px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium text-purple-700">{completedTasks} completed</span>
            </div>
          </div>
          
          <div className="relative">
            <button 
              className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {userInitials}
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-10 border border-gray-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700">John Doe</p>
                  <p className="text-xs text-gray-500">john.doe@example.com</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
