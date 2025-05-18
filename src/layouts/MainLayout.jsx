import React, { useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Header from '../components/Header';
import { TaskIcon, ArchiveIcon, SettingsIcon, CalendarIcon, StatsIcon } from '../assets/icons/IconComponent';

// Keyboard shortcut handler
const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid triggering shortcuts when user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Define shortcuts
      switch (e.key.toLowerCase()) {
        case 'n': // Create new task
          if (!e.ctrlKey && !e.metaKey) {
            document.getElementById('add-task-button')?.click();
          }
          break;
        case 'arrowright': // Navigate right in tabs
          if (e.altKey) {
            const activeTabIndex = Array.from(document.querySelectorAll('nav a')).findIndex(
              el => el.getAttribute('aria-current') === 'page'
            );
            const nextTab = document.querySelectorAll('nav a')[activeTabIndex + 1];
            if (nextTab) nextTab.click();
          }
          break;
        case 'arrowleft': // Navigate left in tabs
          if (e.altKey) {
            const activeTabIndex = Array.from(document.querySelectorAll('nav a')).findIndex(
              el => el.getAttribute('aria-current') === 'page'
            );
            const prevTab = document.querySelectorAll('nav a')[activeTabIndex - 1];
            if (prevTab) prevTab.click();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};

const MainLayout = () => {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();
  
  return (
    <div className="h-screen w-screen flex flex-col bg-[#f5f7fa] overflow-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden animate-fade-in">
        {/* Saving indicator */}
        <div id="saving-indicator" className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm shadow-lg rounded-full px-4 py-2 text-sm flex items-center opacity-0 transition-opacity z-50">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--color-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Saving...</span>
        </div>
        
        {/* Navigation */}
        <div className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-sm shadow-sm">
          <nav className="flex justify-center p-2" aria-label="Main Navigation">
            <div className="flex flex-wrap gap-2 p-1 rounded-full bg-gray-100/80">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-all duration-300 flex items-center ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-white hover:shadow-sm'}`
                }
                aria-current="page"
                end
              >
                <TaskIcon className="h-4 w-4 mr-2" />
                Tasks
              </NavLink>
              <NavLink
                to="/calendar"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-all duration-300 flex items-center ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-white hover:shadow-sm'}`
                }
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </NavLink>
              <NavLink
                to="/statistics"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-all duration-300 flex items-center ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-white hover:shadow-sm'}`
                }
              >
                <StatsIcon className="h-4 w-4 mr-2" />
                Statistics
              </NavLink>
              <NavLink
                to="/archive"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-all duration-300 flex items-center ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-white hover:shadow-sm'}`
                }
              >
                <ArchiveIcon className="h-4 w-4 mr-2" />
                Completed
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-all duration-300 flex items-center ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' : 'text-gray-700 hover:bg-white hover:shadow-sm'}`
                }
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Settings
              </NavLink>
            </div>
          </nav>
        </div>
        
        {/* Page content */}
        <div className="flex-1 overflow-hidden p-4">
          <Outlet />
        </div>
      </main>
      
      <footer className="py-3 px-4 text-center text-sm text-gray-500 bg-white/80 backdrop-blur-sm border-t border-gray-100">
        <p>Todo App &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default MainLayout;
