import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodos, TodoProvider } from '../TodoContext';

// Mock the localStorage implementation
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Setup global localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock the saving indicator
vi.mock('../../hooks/useSavingIndicator', () => ({
  default: () => [false, async (fn) => { await fn(); }],
}));

describe('TodoContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <TodoProvider>{children}</TodoProvider>
  );

  it('provides initial empty todos state', () => {
    // Mock localStorage to return null (no saved todos)
    localStorageMock.getItem.mockReturnValueOnce(null);
    
    const { result } = renderHook(() => useTodos(), { wrapper });
    
    expect(result.current.todos).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('adds a new todo item', async () => {
    const { result } = renderHook(() => useTodos(), { wrapper });
    
    const newTodo = {
      title: 'Test Todo',
      description: 'This is a test',
      priority: 'medium',
      dueDate: new Date().toISOString()
    };
    
    await act(async () => {
      await result.current.addTodo(newTodo);
    });
    
    // Check that the new todo was added with generated id
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe(newTodo.title);
    expect(result.current.todos[0].description).toBe(newTodo.description);
    expect(result.current.todos[0].priority).toBe(newTodo.priority);
    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.todos[0].id).toBeDefined();
  });

  it('toggles a todo completion status', async () => {
    const { result } = renderHook(() => useTodos(), { wrapper });
    
    // First add a todo
    await act(async () => {
      await result.current.addTodo({ title: 'Test Todo' });
    });
    
    const todoId = result.current.todos[0].id;
    const initialStatus = result.current.todos[0].completed;
    
    // Toggle the completion status
    await act(async () => {
      await result.current.toggleTodo(todoId);
    });
    
    // Check if the status was toggled
    expect(result.current.todos[0].completed).toBe(!initialStatus);
    
    // Toggle again
    await act(async () => {
      await result.current.toggleTodo(todoId);
    });
    
    // Should be back to the initial status
    expect(result.current.todos[0].completed).toBe(initialStatus);
  });

  it('deletes a todo item', async () => {
    const { result } = renderHook(() => useTodos(), { wrapper });
    
    // Add two todos
    await act(async () => {
      await result.current.addTodo({ title: 'Todo 1' });
      await result.current.addTodo({ title: 'Todo 2' });
    });
    
    expect(result.current.todos).toHaveLength(2);
    
    const todoIdToDelete = result.current.todos[0].id;
    
    // Delete the first todo
    await act(async () => {
      await result.current.deleteTodo(todoIdToDelete);
    });
    
    // Should have only one todo left
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Todo 2');
  });
  
  it('updates a todo item', async () => {
    const { result } = renderHook(() => useTodos(), { wrapper });
    
    // Add a todo
    await act(async () => {
      await result.current.addTodo({ title: 'Original Title' });
    });
    
    const todoId = result.current.todos[0].id;
    const updatedTodo = {
      ...result.current.todos[0],
      title: 'Updated Title',
      priority: 'high'
    };
    
    // Update the todo
    await act(async () => {
      await result.current.updateTodo(todoId, updatedTodo);
    });
    
    // Check that it was updated
    expect(result.current.todos[0].title).toBe('Updated Title');
    expect(result.current.todos[0].priority).toBe('high');
  });
});
