// filepath: c:\Users\DMA\source\repos\Vibe1\todo-app\src\pages\HomePage.jsx
import React from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import ActivityLogWidget from '../components/advanced/ActivityLogWidget';
import PomodoroTimer from '../components/advanced/PomodoroTimer';
import { TaskIcon } from '../assets/icons/IconComponent';

const HomePage = () => {
  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      {/* Main Task Content Area (70%) */}
      <div className="w-full md:w-[70%] h-full overflow-auto pr-0 md:pr-4">
        <div className="bg-white/90 rounded-2xl shadow-md p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
          <TodoForm />
        </div>
        
        <div className="mt-6 bg-white/90 rounded-2xl shadow-md p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
            <TaskIcon className="h-5 w-5 mr-2 text-indigo-500" />
            My Tasks
          </h2>
          <TodoList />
        </div>
      </div>
      
      {/* Sidebar (30%) */}
      <div className="w-full md:w-[30%] mt-6 md:mt-0 h-full overflow-auto">
        <div className="space-y-6 sticky top-0">
          <div className="bg-white/90 rounded-2xl shadow-md p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <PomodoroTimer />
          </div>
          <div className="bg-white/90 rounded-2xl shadow-md p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <ActivityLogWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
