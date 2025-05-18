import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { Button } from './Button';
import SubtaskList from './advanced/SubtaskList';
import TagManager from './advanced/TagManager';
import RecurringTasksConfig from './advanced/RecurringTasksConfig';
import PomodoroTimer from './advanced/PomodoroTimer';
import { getRecurrenceDescription } from '../utils/dateUtils';

const TodoItem = ({ todo, isSubtask = false, isDraggable = false }) => {
  const { toggleTodo, deleteTodo, updateTodo, getSubtasks } = useTodos();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRecurringConfig, setShowRecurringConfig] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Get subtasks if any
  const subtasks = getSubtasks ? getSubtasks(todo.id) : [];
  const hasSubtasks = subtasks && subtasks.length > 0;
  
  // Format the due date if it exists
  const formattedDate = todo.dueDate 
    ? new Date(todo.dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) 
    : null;
  
  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!todo.dueDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysRemaining = getDaysRemaining();
  
  // Determine the status label and color based on completion and due date
  const getStatusInfo = () => {
    if (todo.completed) {
      return { label: 'Completed', color: 'bg-green-100 text-green-800' };
    }
    
    if (daysRemaining !== null) {
      if (daysRemaining < 0) {
        return { label: 'Overdue', color: 'bg-red-100 text-red-800' };
      }
      if (daysRemaining === 0) {
        return { label: 'Due Today', color: 'bg-orange-100 text-orange-800' };
      }
      if (daysRemaining === 1) {
        return { label: 'Due Tomorrow', color: 'bg-yellow-100 text-yellow-800' };
      }
      if (daysRemaining <= 3) {
        return { label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
      }
    }
    
    if (todo.isRecurring) {
      return { label: 'Recurring', color: 'bg-purple-100 text-purple-800' };
    }
    
    return { label: 'In Progress', color: 'bg-purple-100 text-purple-800' };
  };
  
  const { label: statusLabel, color: statusColor } = getStatusInfo();
  
  // Priority badge
  const getPriorityBadge = () => {
    const colors = {
      high: 'bg-red-500 text-white',
      medium: 'bg-orange-500 text-white',
      low: 'bg-green-500 text-white',
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[todo.priority] || colors.medium}`}>
        {todo.priority?.charAt(0).toUpperCase() + todo.priority?.slice(1) || 'Medium'}
      </span>
    );
  };
  
  // Show confetti animation on task completion
  const handleToggleComplete = () => {
    setIsAnimating(true);
    
    // If the task is being completed (not being un-completed)
    if (!todo.completed) {
      // Create and animate confetti particles
      const confettiCount = 30;
      const colors = ['#FFC700', '#FF0058', '#2E3191', '#41EAD4', '#FBFF12'];
      
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '50%';
      container.style.top = '50%';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '10';
      
      document.getElementById(`todo-item-${todo.id}`).appendChild(container);
      
      for (let i = 0; i < confettiCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        // Set random position around the origin
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50;
        particle.style.left = `${Math.cos(angle) * distance}px`;
        particle.style.top = `${Math.sin(angle) * distance}px`;
        
        container.appendChild(particle);
        
        // Add animation
        particle.style.animation = 'confetti 1s ease-out forwards';
        particle.style.transformOrigin = 'center center';
        particle.style.animationDelay = `${Math.random() * 0.3}s`;
      }
      
      // Clean up after animation
      setTimeout(() => {
        try {
          container.remove();
        } catch (e) {
          // Element might already be gone if todo was deleted
        }
      }, 2000);
    }
    
    // Toggle the todo status
    toggleTodo(todo.id);
  };

  return (
    <div 
      id={`todo-item-${todo.id}`}
      className={`relative overflow-hidden mb-3 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ${
        isAnimating ? 'animate-pulse' : ''
      } ${
        todo.completed 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-100 hover:border-blue-200'
      } ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''} ${isSubtask ? 'border-l-4 border-l-indigo-400' : ''}`}
      onAnimationEnd={() => setIsAnimating(false)}
    >
      <div className="p-5">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-1">
            <div className="relative inline-block">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={handleToggleComplete}
                className="peer absolute opacity-0 w-5 h-5 cursor-pointer z-10"
                aria-label={`Mark ${todo.title} as ${todo.completed ? 'incomplete' : 'complete'}`}
              />
              <div className="w-5 h-5 border-2 rounded-full transition-all duration-300 flex items-center justify-center
                peer-checked:bg-gradient-to-r peer-checked:from-green-400 peer-checked:to-green-500 
                peer-checked:border-green-500 border-gray-300
                peer-hover:border-indigo-400">
                {todo.completed && (
                  <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </div>
          
          <div className="ml-3 flex-1">
            <div className="flex flex-col md:flex-row md:items-start justify-between">
              <div className="pr-8">
                <h3 className={`text-base font-medium ${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                }`}>
                  {todo.title}
                </h3>
                
                {/* Recurring task indicator */}
                {todo.isRecurring && (
                  <div className="text-xs text-indigo-600 flex items-center mt-1">
                    <svg className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    {getRecurrenceDescription(todo.recurrencePattern)}
                  </div>
                )}
                
                {/* Only show description when expanded */}
                {todo.description && isExpanded && (
                  <div className="mt-2 text-sm text-gray-600">{todo.description}</div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0 md:ml-auto items-center">
                {getPriorityBadge()}
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                  {statusLabel}
                </span>
                {formattedDate && (
                  <span className="text-xs py-1 px-2 rounded-full bg-gray-100 text-gray-700">
                    {formattedDate}
                  </span>
                )}
              </div>
            </div>
            
            {/* Tags */}
            {todo.tags && todo.tags.length > 0 && (
              <div className="mt-3">
                <TagManager todo={todo} />
              </div>
            )}
            
            {/* Expandable section */}
            {(todo.description || formattedDate || hasSubtasks) && (
              <div className="mt-3">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center px-2 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  {isExpanded ? 'Show Less' : 'Show More'}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-gray-100 animate-fade-in">
                    {/* Existing expanded content... */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-2">
                      {formattedDate && (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span>Due: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</span>
                        </div>
                      )}
                      {todo.createdAt && (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>Created: {new Date(todo.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => updateTodo(todo.id, todo)}
                        className="text-xs px-3 py-1.5 flex items-center rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors shadow-sm hover:shadow"
                      >
                        <svg className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                    
                      {!isSubtask && (
                        <button
                          onClick={() => setShowRecurringConfig(!showRecurringConfig)}
                          className="text-xs px-3 py-1.5 flex items-center rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors shadow-sm hover:shadow"
                        >
                          <svg className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                          {todo.isRecurring ? 'Edit Recurrence' : 'Make Recurring'}
                        </button>
                      )}
                      
                      <button
                        onClick={() => setShowPomodoro(!showPomodoro)}
                        className="text-xs px-3 py-1.5 flex items-center rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-colors shadow-sm hover:shadow"
                      >
                        <svg className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Focus Timer
                      </button>
                      
                      {!isSubtask && (
                        <button
                          onClick={() => updateTodo(todo.id, { tags: todo.tags || [] })}
                          className="text-xs px-3 py-1.5 flex items-center rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-sm hover:shadow"
                        >
                          <svg className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                          Manage Tags
                        </button>
                      )}
                    </div>
                    
                    {/* Recurring task configuration */}
                    {showRecurringConfig && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="bg-purple-50 rounded-xl p-3 shadow-inner">
                          <RecurringTasksConfig 
                            todo={todo} 
                            onClose={() => setShowRecurringConfig(false)} 
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Pomodoro timer */}
                    {showPomodoro && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="bg-red-50 rounded-xl p-3 shadow-inner">
                          <PomodoroTimer todoId={todo.id} />
                        </div>
                      </div>
                    )}
                    
                    {/* Subtasks */}
                    {!isSubtask && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <SubtaskList parentId={todo.id} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute right-3 top-3 flex items-center gap-1">
        <button 
          onClick={() => updateTodo(todo.id, todo)}
          className="text-gray-400 hover:text-indigo-500 p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
          aria-label="Edit task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        
        <button 
          onClick={() => deleteTodo(todo.id)}
          className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors"
          aria-label="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TodoItem;