import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '../TodoForm';
import { renderWithProviders } from '../../utils/test-utils';
import * as TodoContext from '../../context/TodoContext';

describe('TodoForm Component', () => {
  it('renders collapsed form initially with "Add Task" button', () => {
    // Mock the useTodos hook
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      addTodo: vi.fn()
    });
    
    renderWithProviders(<TodoForm />);
    
    // Initially, only the "Add Task" button should be visible
    const addButton = screen.getByRole('button', { name: /add task/i });
    expect(addButton).toBeInTheDocument();
    
    // Form fields should not be visible yet
    const titleInput = screen.queryByPlaceholderText(/task title/i);
    expect(titleInput).not.toBeInTheDocument();
  });
  
  it('expands the form when "Add Task" is clicked', async () => {
    // Mock the useTodos hook
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      addTodo: vi.fn()
    });
    
    renderWithProviders(<TodoForm />);
    
    // Click the "Add Task" button
    const addButton = screen.getByRole('button', { name: /add task/i });
    await userEvent.click(addButton);
    
    // Now the form fields should be visible
    const titleInput = screen.getByPlaceholderText(/task title/i);
    expect(titleInput).toBeInTheDocument();
    
    const descriptionInput = screen.getByPlaceholderText(/description/i);
    expect(descriptionInput).toBeInTheDocument();
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    expect(submitButton).toBeInTheDocument();
  });
  
  it('submits the form with correct data', async () => {
    // Mock addTodo function
    const mockAddTodo = vi.fn();
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      addTodo: mockAddTodo
    });
    
    renderWithProviders(<TodoForm />);
    
    // Expand the form
    const addButton = screen.getByRole('button', { name: /add task/i });
    await userEvent.click(addButton);
    
    // Fill out the form
    const titleInput = screen.getByPlaceholderText(/task title/i);
    await userEvent.type(titleInput, 'New Test Task');
    
    const descriptionInput = screen.getByPlaceholderText(/description/i);
    await userEvent.type(descriptionInput, 'This is a test task');
    
    // Select priority
    const priorityDropdown = screen.getByLabelText(/priority/i);
    await userEvent.selectOptions(priorityDropdown, 'high');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(submitButton);
    
    // Check if addTodo was called with correct data
    expect(mockAddTodo).toHaveBeenCalledTimes(1);
    expect(mockAddTodo).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Test Task',
      description: 'This is a test task',
      priority: 'high',
      completed: false
    }));
    
    // Form should collapse after submission
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/task title/i)).not.toBeInTheDocument();
    });
  });
  
  it('validates form inputs before submission', async () => {
    const mockAddTodo = vi.fn();
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      addTodo: mockAddTodo
    });
    
    renderWithProviders(<TodoForm />);
    
    // Expand the form
    const addButton = screen.getByRole('button', { name: /add task/i });
    await userEvent.click(addButton);
    
    // Try to submit without title
    const submitButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(submitButton);
    
    // Should show error and not call addTodo
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(mockAddTodo).not.toHaveBeenCalled();
    
    // Now add title and submit
    const titleInput = screen.getByPlaceholderText(/task title/i);
    await userEvent.type(titleInput, 'Valid Task');
    await userEvent.click(submitButton);
    
    // Now it should be called
    expect(mockAddTodo).toHaveBeenCalledTimes(1);
  });
});
