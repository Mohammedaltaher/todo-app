// src/components/advanced/SubtaskList.jsx
import { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import * as Accordion from '@radix-ui/react-accordion';
import TodoItem from '../TodoItem';

const SubtaskList = ({ parentId }) => {
  const { getSubtasks, addSubtask } = useTodos();
  const [newSubtask, setNewSubtask] = useState({ title: '', description: '', dueDate: '', priority: 'medium' });
  const [showForm, setShowForm] = useState(false);
  
  // Get subtasks for this parent
  const subtasks = getSubtasks(parentId);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newSubtask.title.trim()) return;
    
    // Add the subtask
    await addSubtask(parentId, newSubtask);
    
    // Reset the form
    setNewSubtask({ title: '', description: '', dueDate: '', priority: 'medium' });
    setShowForm(false);
  };
  
  return (
    <div className="mt-3 pl-6 border-l-2 border-gray-200">
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="subtasks">
          <Accordion.Trigger className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
            <span>Subtasks ({subtasks.length})</span>
            <svg 
              className="ml-1 h-4 w-4 transform transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Accordion.Trigger>
          
          <Accordion.Content className="pt-2 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            {subtasks.length > 0 ? (
              <div className="space-y-2">
                {subtasks.map(subtask => (
                  <TodoItem key={subtask.id} todo={subtask} isSubtask={true} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No subtasks yet.</p>
            )}
            
            {!showForm ? (
              <button 
                onClick={() => setShowForm(true)}
                className="mt-2 text-sm flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Subtask
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="mt-3 bg-gray-50 p-3 rounded-lg">
                <div className="mb-2">
                  <input
                    type="text"
                    value={newSubtask.title}
                    onChange={(e) => setNewSubtask({...newSubtask, title: e.target.value})}
                    placeholder="Subtask title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                    required
                  />
                </div>
                
                <div className="mb-2">
                  <textarea
                    value={newSubtask.description}
                    onChange={(e) => setNewSubtask({...newSubtask, description: e.target.value})}
                    placeholder="Description (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                    rows="2"
                  />
                </div>
                
                <div className="flex space-x-2 mb-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Due Date (optional)</label>
                    <input
                      type="date"
                      value={newSubtask.dueDate}
                      onChange={(e) => setNewSubtask({...newSubtask, dueDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Priority</label>
                    <select
                      value={newSubtask.priority}
                      onChange={(e) => setNewSubtask({...newSubtask, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-dark)]"
                  >
                    Add Subtask
                  </button>
                </div>
              </form>
            )}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
};

export default SubtaskList;
