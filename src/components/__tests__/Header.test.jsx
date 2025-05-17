import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Header from '../Header';
import { renderWithProviders, sampleTodos } from '../../utils/test-utils';
import * as TodoContext from '../../context/TodoContext';

describe('Header Component', () => {
  it('renders the header with the date', () => {
    // Mock the useTodos hook to return sample todos
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      todos: sampleTodos
    });
    
    renderWithProviders(<Header />);
    
    // Check for header content
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // The date should be in the header
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
    
    // Look for pending or completed text instead of tasks
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
    
    // Verify the task count from our sample data
    const pendingCount = sampleTodos.filter(todo => !todo.completed).length;
    const completedCount = sampleTodos.filter(todo => todo.completed).length;
    
    expect(screen.getByText(new RegExp(`${pendingCount}\\s*pending`, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${completedCount}\\s*completed`, 'i'))).toBeInTheDocument();
  });
  
  it('renders the logo and navigation links', () => {
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      todos: []
    });
    
    renderWithProviders(<Header />);
    
    // Check for logo
    expect(screen.getByAltText(/todo app logo/i) || 
           screen.getByText(/todo app/i)).toBeInTheDocument();
    
    // Check for navigation links
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/archive/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });
});
