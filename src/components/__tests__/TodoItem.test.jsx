import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from '../TodoItem';
import { renderWithProviders } from '../../utils/test-utils';
import * as TodoContext from '../../context/TodoContext';

describe('TodoItem Component', () => {
  // Sample todo for testing
  const sampleTodo = {
    id: 'test-id-123',
    title: 'Test Todo Item',
    description: 'This is a test description',
    dueDate: new Date('2025-12-31').toISOString(),
    priority: 'high',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Mock the context functions
  const mockToggleTodo = vi.fn();
  const mockDeleteTodo = vi.fn();
  const mockUpdateTodo = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      toggleTodo: mockToggleTodo,
      deleteTodo: mockDeleteTodo,
      updateTodo: mockUpdateTodo,
    });
  });

  it('renders a todo item with correct information', () => {
    renderWithProviders(<TodoItem todo={sampleTodo} />);
    
    // Title should be displayed
    expect(screen.getByText(sampleTodo.title)).toBeInTheDocument();
    
    // Due date should be formatted and displayed
    const formattedDate = new Date(sampleTodo.dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    expect(screen.getByText(formattedDate, { exact: false })).toBeInTheDocument();
    
    // Priority indicator should be visible
    // This test assumes there's some visual indicator of priority
    const priorityElement = screen.getByText(/high/i) || 
                           document.querySelector('[data-priority="high"]');
    expect(priorityElement).toBeInTheDocument();
  });
  
  it('toggles todo completion status when checkbox is clicked', async () => {
    renderWithProviders(<TodoItem todo={sampleTodo} />);
    
    // Find the checkbox (could be a styled element or actual checkbox)
    const checkbox = screen.getByRole('checkbox') || 
                    document.querySelector('[type="checkbox"]') ||
                    document.querySelector('[data-testid="todo-checkbox"]');
    
    // Click the checkbox
    await userEvent.click(checkbox);
    
    // Check if toggleTodo was called with the correct ID
    expect(mockToggleTodo).toHaveBeenCalledWith(sampleTodo.id);
  });
  
  it('deletes the todo when delete button is clicked', async () => {
    renderWithProviders(<TodoItem todo={sampleTodo} />);
    
    // Expand the item first
    const todoItem = screen.getByText(sampleTodo.title).closest('div');
    await userEvent.click(todoItem);
    
    // Find and click the delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);
    
    // Check if deleteTodo was called with the correct ID
    expect(mockDeleteTodo).toHaveBeenCalledWith(sampleTodo.id);
  });
});
