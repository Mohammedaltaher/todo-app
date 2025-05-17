import React from 'react';
import { useTodos } from '../context/TodoContext';

const Header = () => {
  const { todos } = useTodos();
  
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

  return (
    <header className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white py-6 px-6 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Task Master</h1>
            <p className="text-sm opacity-90">{formattedDate}</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <p className="text-md font-medium">{randomGreeting}</p>
            <div className="flex mt-2 space-x-4">
              <div className="text-sm">
                <span className="font-semibold">{pendingTasks}</span> pending
              </div>
              <div className="text-sm">
                <span className="font-semibold">{completedTasks}</span> completed
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
