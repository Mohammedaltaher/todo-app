import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { Button } from './Button';

const TodoForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
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
    addTodo(title, dueDate, description, priority);
    
    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    
    // Show success message or animation
    const successMessage = document.getElementById('success-message');
    successMessage.classList.remove('hidden');
    setTimeout(() => {
      successMessage.classList.add('hidden');
    }, 3000);

    // Collapse the form after submit
    setIsFormVisible(false);
  };

  const priorityClasses = {
    high: 'bg-[var(--color-priority-high)] text-white',
    medium: 'bg-[var(--color-priority-medium)] text-white',
    low: 'bg-[var(--color-priority-low)] text-white',
  };

  return (
    <div className="mb-8">
      {!isFormVisible ? (
        <div className="text-center">
          <Button 
            onClick={() => setIsFormVisible(true)}
            className="btn-primary px-6 py-3 text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Task
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading text-lg font-semibold">Create New Task</h3>
            <button 
              type="button" 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setIsFormVisible(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md mb-4 animate-shake">
              {error}
            </div>
          )}
          
          <div id="success-message" className="bg-green-50 text-green-600 px-4 py-2 rounded-md mb-4 hidden animate-fade-in">
            Task added successfully!
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
              className="input w-full"
              placeholder="Task Title"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full min-h-[80px]"
              placeholder="Description"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date (optional)
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input w-full"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label id="priority-label" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <div className="flex space-x-2" role="group" aria-labelledby="priority-label">
                {['high', 'medium', 'low'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      priority === p ? priorityClasses[p] : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-pressed={priority === p}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setIsFormVisible(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TodoForm;
