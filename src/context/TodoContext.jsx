// src/context/TodoContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useSavingIndicator from '../hooks/useSavingIndicator';

// Create a context for our todo items
const TodoContext = createContext();

// Custom hook to use the todo context
export const useTodos = function useTodos() {
  return useContext(TodoContext);
};

export const TodoProvider = ({ children }) => {
  // Use our custom hooks
  const [todos, setTodos] = useLocalStorage('todos', []);
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
  const addTodo = async (title, dueDate, description = '', priority = 'medium') => {
    const newTodo = {
      id: Date.now().toString(),
      title,
      description,
      dueDate,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await save(() => {
      setTodos([...todos, newTodo]);
    });
    
    return newTodo;
  };
  
  // Toggle todo completion status
  const toggleTodo = async (id) => {
    await save(() => {
      setTodos(todos =>
        todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() } : todo
        )
      );
    });
  };

  // Edit a todo
  const editTodo = async (id, updates) => {
    await save(() => {
      setTodos(todos =>
        todos.map(todo =>
          todo.id === id ? { ...todo, ...updates, updatedAt: new Date().toISOString() } : todo
        )
      );
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
      setTodos(todos => todos.filter(todo => todo.id !== id));
    });
  };

  // Archive completed todos
  const archiveCompleted = async () => {
    await save(() => {
      setTodos(todos => todos.filter(todo => !todo.completed));
    });
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        isLoading,
        isSaving,
        addTodo,
        toggleTodo,
        editTodo,
        deleteTodo,
        archiveCompleted,
        updateTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
