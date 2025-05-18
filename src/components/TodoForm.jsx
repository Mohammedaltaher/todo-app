import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { Button } from './Button';
import TagManager from './advanced/TagManager';
import RecurringTasksConfig from './advanced/RecurringTasksConfig';

const TodoForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tags, setTags] = useState([]);
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);
  const [recurringConfig, setRecurringConfig] = useState({
    isRecurring: false,
    frequency: 'daily',
    interval: 1,
    endDate: '',
    daysOfWeek: []
  });
  const [error, setError] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const { addTodo } = useTodos();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!title.trim()) {
      setError('Task title is required');
      // Add shake animation to the input
      document.getElementById('title').classList.add('animate-shake');
      setTimeout(() => {
        document.getElementById('title').classList.remove('animate-shake');
      }, 500);
      return;
    }
    
    // Clear any error
    setError('');
    
    // Add the todo
    addTodo(title, dueDate, description, priority, tags, recurringConfig.isRecurring ? recurringConfig : null);
    
    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setTags([]);
    setRecurringConfig({
      isRecurring: false,
      frequency: 'daily',
      interval: 1,
      endDate: '',
      daysOfWeek: []
    });
    
    // Show success message or animation
    const successMessage = document.getElementById('success-message');
    successMessage.classList.remove('hidden');
    setTimeout(() => {
      successMessage.classList.add('hidden');
    }, 3000);

    // Collapse the form after submit
    setIsFormVisible(false);
  };

  const priorityColors = {
    high: 'from-red-500 to-red-600',
    medium: 'from-orange-500 to-orange-600',
    low: 'from-green-500 to-green-600',
  };

  return (
    <div className="mb-6">
      {!isFormVisible ? (
        <div className="flex justify-center">
          <Button 
            onClick={() => setIsFormVisible(true)}
            id="add-task-button"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Task
          </Button>
          <div className="ml-3 text-sm text-gray-500 hidden md:flex items-center opacity-70">
            <kbd className="px-2 py-1 bg-gray-100 rounded-md text-xs mr-1">N</kbd>
            <span>New Task</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Create New Task</h3>
            <button 
              type="button" 
              className="text-gray-400 hover:text-gray-600 rounded-full p-1.5 hover:bg-gray-100 transition-colors"
              onClick={() => setIsFormVisible(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl mb-4 animate-pulse border border-red-100">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          <div id="success-message" className="bg-green-50 text-green-600 px-4 py-2 rounded-xl mb-4 hidden animate-fade-in border border-green-100">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Task added successfully!
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title*
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-colors"
              placeholder="What needs to be done?"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-colors"
              />
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <div className="flex space-x-2">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      priority === p 
                        ? `bg-gradient-to-r ${priorityColors[p]} text-white shadow-md border-transparent` 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 transition-colors"
              placeholder="Add details about your task (optional)"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <TagManager 
              todoTags={tags} 
              onTagsChange={setTags} 
              editable={true}
              createNewTags={true}
            />
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Recurring Task
              </label>
              <button
                type="button"
                onClick={() => setShowRecurringOptions(!showRecurringOptions)}
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
              >
                {showRecurringOptions ? 'Hide Options' : 'Show Options'}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ml-1 transition-transform duration-200 ${showRecurringOptions ? 'rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className={`transition-all duration-300 overflow-hidden ${
              showRecurringOptions ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
            }`}>
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <RecurringTasksConfig 
                  config={recurringConfig} 
                  onChange={setRecurringConfig} 
                  isConfiguring={true}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setIsFormVisible(false)}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              Create Task
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TodoForm;
