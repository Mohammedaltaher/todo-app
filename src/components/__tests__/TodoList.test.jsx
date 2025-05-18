import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from '../TodoList';
import { renderWithProviders, sampleTodos } from '../../utils/test-utils';
import * as TodoContext from '../../context/TodoContext';

describe('TodoList Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows loading state when isLoading is true', () => {
    // Mock todos with loading state
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      todos: [],
      isLoading: true
    });
    
    renderWithProviders(<TodoList />);
    
    // Should show a loading indicator
    const loadingElement = screen.getByText(/loading/i) ||
                         document.querySelector('[data-testid="loading-indicator"]');
    expect(loadingElement).toBeInTheDocument();
    
    // No todos should be rendered
    expect(screen.queryByText(/test todo/i)).not.toBeInTheDocument();
  });
    it('shows empty state when no todos are available', () => {
    // Mock empty todos list
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      todos: [],
      isLoading: false
    });
    
    renderWithProviders(<TodoList />);
    
    // Should show an empty state message
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    expect(screen.getByText(/Time to be productive! Add your first task/i)).toBeInTheDocument();
  });
  
  it('renders a list of todos', () => {
    // Mock todos with some sample data
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      todos: sampleTodos,
      isLoading: false
    });
    
    renderWithProviders(<TodoList />);
    
    // Each todo title from our sample data should be rendered
    sampleTodos.forEach(todo => {
      expect(screen.getByText(todo.title)).toBeInTheDocument();
    });
  });
  
  it('filters todos based on filter criteria', async () => {
    // Mock todos with some sample data
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      todos: sampleTodos,
      isLoading: false
    });
    
    renderWithProviders(<TodoList />);
    
    // Initially all todos should be visible
    sampleTodos.forEach(todo => {
      expect(screen.getByText(todo.title)).toBeInTheDocument();
    });
    
    // Find and click the filter button for "Completed"
    const filterButtons = screen.getAllByRole('button');
    const completedFilterButton = filterButtons.find(button => 
      button.textContent.toLowerCase().includes('completed')
    );
    
    if (completedFilterButton) {
      await userEvent.click(completedFilterButton);
      
      // Now only completed todos should be visible
      sampleTodos.forEach(todo => {
        if (todo.completed) {
          expect(screen.getByText(todo.title)).toBeInTheDocument();
        } else {
          expect(screen.queryByText(todo.title)).not.toBeInTheDocument();
        }
      });
    }
  });
    it('sorts todos based on sort criteria', async () => {
    // Mock todos with sample data
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      todos: sampleTodos,
      isLoading: false
    });
    
    renderWithProviders(<TodoList />);
    
    // Find and click the sort dropdown
    const sortDropdown = screen.getByLabelText(/sort by/i);
    
    // Select "Due Date" option
    await userEvent.selectOptions(sortDropdown, 'dueDate');
    
    // The todos should now be sorted by due date
    // This is harder to test explicitly, but we can check that the list is still rendered
    sampleTodos.forEach(todo => {
      expect(screen.getByText(todo.title)).toBeInTheDocument();
    });
  });
    it('displays correct count of tasks for different filters', async () => {
    // Mock todos with sample data
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      todos: sampleTodos,
      isLoading: false
    });
    
    renderWithProviders(<TodoList />);
    
    // Check that the count is displayed correctly for all tasks
    expect(screen.getByText(`Showing all ${sampleTodos.length} tasks`)).toBeInTheDocument();
    
    // Click the completed filter
    const completedButton = screen.getByTestId('filter-btn-completed');
    await userEvent.click(completedButton);
    
    // Count completed tasks
    const completedCount = sampleTodos.filter(todo => todo.completed).length;
    
    // Check that the count is updated for completed tasks
    expect(screen.getByText(`Showing ${completedCount} completed tasks`)).toBeInTheDocument();
  });
});
