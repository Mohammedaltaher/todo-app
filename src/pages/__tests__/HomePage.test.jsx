import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import HomePage from '../HomePage';
import { renderWithProviders } from '../../utils/test-utils';

describe('HomePage Component', () => {
  it('renders the homepage with required elements', async () => {
    renderWithProviders(<HomePage />);
    
    // The page should have a heading for "My Tasks"
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    
    // Expand the TodoForm so the input is visible
    const addButton = screen.getByRole('button', { name: /add task/i });
    await addButton.click();
    
    // Now the input should be present
    const addTaskElement = screen.getByPlaceholderText(/task title/i) || 
                         screen.getByRole('textbox') ||
                         screen.getByLabelText(/task title/i);
    expect(addTaskElement).toBeInTheDocument();
    
    // Look for add task button (Save)
    const saveButton = screen.getByRole('button', { name: /add|create|save/i });
    expect(saveButton).toBeInTheDocument();
    
    // Check for TodoList container (even if it's empty)
    const todoListContainer = document.querySelector('[data-testid="todo-list"]') || 
                             document.querySelector('.todo-list') ||
                             screen.getByRole('list');
    expect(todoListContainer).toBeInTheDocument();
  });
});
