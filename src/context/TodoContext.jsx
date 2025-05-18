// src/context/TodoContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useSavingIndicator from '../hooks/useSavingIndicator';
import { isRecurringTaskDueToday } from '../utils/dateUtils';
import { exportToCSV, exportToJSON, importFromCSV, importFromJSON } from '../utils/exportImport';

// Create a context for our todo items
const TodoContext = createContext();

// Custom hook to use the todo context
export const useTodos = function useTodos() {
  return useContext(TodoContext);
};

export const TodoProvider = ({ children }) => {
  // Use our custom hooks
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [tags, setTags] = useLocalStorage('tags', []);
  const [activityLog, setActivityLog] = useLocalStorage('activityLog', []);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, save] = useSavingIndicator();
  
  // Simulate initial loading (for demo purposes)
  useEffect(() => {
    // Simulate a loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);
    // Add a new todo
  const addTodo = async (title, dueDate, description = '', priority = 'medium', tags = [], isRecurring = false, recurrencePattern = null, parentId = null) => {
    const newTodo = {
      id: Date.now().toString(),
      title,
      description,
      dueDate,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tags || [],
      isRecurring: isRecurring || false,
      recurrencePattern: recurrencePattern || null,
      parentId: parentId || null,
      subtasks: []
    };
    
    await save(() => {
      setTodos(prevTodos => [...prevTodos, newTodo]);
      
      // Log the activity
      logActivity('create', newTodo);
    });
    
    return newTodo;
  };
    // Toggle todo completion status
  const toggleTodo = async (id) => {
    await save(() => {
      setTodos(prevTodos => {
        const updatedTodos = prevTodos.map(todo => {
          if (todo.id === id) {
            const updatedTodo = { 
              ...todo, 
              completed: !todo.completed, 
              updatedAt: new Date().toISOString() 
            };
            
            // Handle recurring task completions
            if (updatedTodo.isRecurring && updatedTodo.completed) {
              // Mark this instance as completed
              const today = new Date().toISOString().split('T')[0];
              updatedTodo.completedInstances = [...(updatedTodo.completedInstances || []), today];
            }
            
            // Log activity
            logActivity(
              updatedTodo.completed ? 'complete' : 'uncomplete', 
              updatedTodo
            );
            
            return updatedTodo;
          }
          return todo;
        });
        
        return updatedTodos;
      });
    });
  };
  // Edit a todo
  const editTodo = async (id, updates) => {
    await save(() => {
      setTodos(prevTodos => {
        const updatedTodos = prevTodos.map(todo => {
          if (todo.id === id) {
            const updatedTodo = { 
              ...todo, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            };
            
            // Log the activity
            logActivity('update', updatedTodo);
            
            return updatedTodo;
          }
          return todo;
        });
        
        return updatedTodos;
      });
    });
  };

  // Update a todo
  const updateTodo = (id, updatedTodo) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, ...updatedTodo } : todo
      )
    );
  };
  // Delete a todo
  const deleteTodo = async (id) => {
    await save(() => {
      // Find the todo before deleting to log activity
      const todoToDelete = todos.find(todo => todo.id === id);
      
      // Delete the todo and any subtasks
      setTodos(prevTodos => {
        // Filter out the todo with the given id and any subtasks
        const filteredTodos = prevTodos.filter(todo => 
          todo.id !== id && todo.parentId !== id
        );
        
        return filteredTodos;
      });
      
      // Log the activity if todo was found
      if (todoToDelete) {
        logActivity('delete', todoToDelete);
      }
    });
  };
  // Archive completed todos
  const archiveCompleted = async () => {
    await save(() => {
      // Find completed todos for logging
      const completedTodos = todos.filter(todo => todo.completed);
      
      // Remove completed todos
      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
      
      // Log archiving activity
      completedTodos.forEach(todo => {
        logActivity('archive', todo);
      });
    });
  };
  
  // Add a subtask to a parent todo
  const addSubtask = async (parentId, subtaskData) => {
    const { title, description, dueDate, priority } = subtaskData;
    
    // Create the subtask
    const subtask = await addTodo(
      title, 
      dueDate, 
      description, 
      priority,
      [], // tags
      false, // isRecurring
      null, // recurrencePattern
      parentId // parentId
    );
    
    return subtask;
  };
  
  // Get all subtasks for a given parent todo
  const getSubtasks = (parentId) => {
    return todos.filter(todo => todo.parentId === parentId);
  };
  
  // Log an activity
  const logActivity = (action, todo) => {
    const activity = {
      id: Date.now().toString(),
      action,
      todoId: todo.id,
      todoTitle: todo.title,
      timestamp: new Date().toISOString(),
      details: {
        priority: todo.priority,
        dueDate: todo.dueDate,
        completed: todo.completed
      }
    };
    
    setActivityLog(prevLog => [activity, ...prevLog]);
  };
  
  // Get activity logs, optionally filtered
  const getActivityLogs = (filter = {}) => {
    let filteredLogs = [...activityLog];
    
    // Apply filters if provided
    if (filter.todoId) {
      filteredLogs = filteredLogs.filter(log => log.todoId === filter.todoId);
    }
    
    if (filter.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filter.action);
    }
    
    if (filter.dateFrom) {
      const fromDate = new Date(filter.dateFrom);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= fromDate);
    }
    
    if (filter.dateTo) {
      const toDate = new Date(filter.dateTo);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= toDate);
    }
    
    // Return most recent logs first
    return filteredLogs;
  };
  
  // Manage tags
  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags(prevTags => [...prevTags, tag]);
    }
  };
  
  const removeTag = (tag) => {
    setTags(prevTags => prevTags.filter(t => t !== tag));
    
    // Also remove this tag from all todos
    setTodos(prevTodos => 
      prevTodos.map(todo => ({
        ...todo,
        tags: todo.tags?.filter(t => t !== tag) || []
      }))
    );
  };
  
  // Add or remove a tag from a todo
  const toggleTodoTag = async (todoId, tag) => {
    await save(() => {
      setTodos(prevTodos => {
        return prevTodos.map(todo => {
          if (todo.id === todoId) {
            // Check if todo already has this tag
            const hasTag = todo.tags?.includes(tag);
            let updatedTags;
            
            if (hasTag) {
              // Remove tag
              updatedTags = todo.tags.filter(t => t !== tag);
            } else {
              // Add tag (ensure tags array exists)
              updatedTags = [...(todo.tags || []), tag];
              
              // Also add to global tags if not present
              if (!tags.includes(tag)) {
                addTag(tag);
              }
            }
            
            return {
              ...todo,
              tags: updatedTags,
              updatedAt: new Date().toISOString()
            };
          }
          return todo;
        });
      });
    });
  };
  
  // Export todos to CSV or JSON
  const exportTodos = (format = 'json') => {
    try {
      if (format === 'csv') {
        return exportToCSV(todos);
      } else {
        return exportToJSON(todos);
      }
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  };
  
  // Import todos from CSV or JSON
  const importTodos = async (data, format = 'json', strategy = 'merge') => {
    try {
      let importedTodos;
      
      // Parse data based on format
      if (format === 'csv') {
        importedTodos = await importFromCSV(data);
      } else {
        importedTodos = importFromJSON(data);
      }
      
      await save(() => {
        // Apply import strategy
        if (strategy === 'replace') {
          // Replace all existing todos
          setTodos(importedTodos);
        } else {
          // Merge with existing todos
          // For duplicates (same id), use the imported version
          const existingIds = todos.map(t => t.id);
          const newTodos = importedTodos.filter(t => !existingIds.includes(t.id));
          const updatedExisting = todos.map(todo => {
            const imported = importedTodos.find(t => t.id === todo.id);
            return imported || todo;
          });
          
          setTodos([...updatedExisting, ...newTodos]);
        }
      });
      
      // Log activity
      logActivity('import', { 
        id: 'import-' + Date.now(),
        title: `Imported ${importedTodos.length} todos`,
      });
      
      return importedTodos.length;
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  };
  
  // Reorder todos (for drag and drop)
  const reorderTodos = async (startIndex, endIndex) => {
    await save(() => {
      setTodos(prevTodos => {
        const result = Array.from(prevTodos);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
      });
    });
  };
  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        tags,
        isLoading,
        isSaving,
        addTodo,
        toggleTodo,
        editTodo,
        deleteTodo,
        archiveCompleted,
        updateTodo,
        addSubtask,
        getSubtasks,
        getActivityLogs,
        addTag,
        removeTag,
        toggleTodoTag,
        exportTodos,
        importTodos,
        reorderTodos
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
