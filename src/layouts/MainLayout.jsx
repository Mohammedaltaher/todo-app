import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Header from '../components/Header';
import { TaskIcon, ArchiveIcon, SettingsIcon } from '../assets/icons/IconComponent';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-light)]">
      <Header />
      
      <main className="container mx-auto py-6 px-4 animate-fade-in">
        {/* Saving indicator */}
        <div id="saving-indicator" className="fixed bottom-4 right-4 bg-white shadow-lg rounded-full px-4 py-2 text-sm flex items-center opacity-0 transition-opacity z-10">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--color-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Saving...</span>
        </div>
        
        {/* Navigation */}
        <div className="max-w-3xl mx-auto mb-6 flex justify-center">
          <nav className="bg-white rounded-lg shadow-md p-1 flex space-x-1" aria-label="Main Navigation">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors flex items-center ${isActive ? 'bg-[var(--color-primary)] text-white' : 'text-gray-600 hover:bg-gray-100'}`
              }
              aria-current="page"
              end
            >
              <TaskIcon className="h-4 w-4 mr-2" />
              Tasks
            </NavLink>
            <NavLink
              to="/archive"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors flex items-center ${isActive ? 'bg-[var(--color-primary)] text-white' : 'text-gray-600 hover:bg-gray-100'}`
              }
            >
              <ArchiveIcon className="h-4 w-4 mr-2" />
              Completed
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors flex items-center ${isActive ? 'bg-[var(--color-primary)] text-white' : 'text-gray-600 hover:bg-gray-100'}`
              }
            >
              <SettingsIcon className="h-4 w-4 mr-2" />
              Settings
            </NavLink>
          </nav>
        </div>
        
        {/* Page content from child routes */}
        <Outlet />
      </main>
      
      <footer className="container mx-auto py-4 px-4 text-center text-sm text-gray-500">
        <p>Todo App &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};


export default MainLayout;
