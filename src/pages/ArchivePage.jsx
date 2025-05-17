import React from 'react';
import { useTodos } from '../context/TodoContext';
import TodoItem from '../components/TodoItem';
import { ArchiveIcon, CheckIcon } from '../assets/icons/IconComponent';

const ArchivePage = () => {
  const { todos } = useTodos();
  
  // Filter for completed tasks
  const completedTasks = todos.filter(todo => todo.completed);
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <ArchiveIcon className="h-6 w-6 mr-2 text-[var(--color-primary)]" />
        Completed Tasks
      </h1>
      
      {completedTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <CheckIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No completed tasks yet</h3>
          <p className="text-gray-400">Completed tasks will appear here for your reference.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="space-y-2">
            {completedTasks.map(todo => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivePage;
