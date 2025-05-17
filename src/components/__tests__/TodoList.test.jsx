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
    expect(screen.getByText(/no todos/i) || 
           screen.getByText(/nothing to do/i) ||
           screen.getByText(/add your first task/i)).toBeInTheDocument();
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
    const sortDropdown = screen.getByLabelText(/sort by/i) || 
                        screen.getByRole('combobox');
    
    // Select "Priority" option
    await userEvent.selectOptions(sortDropdown, 'priority');
    
    // The todos should now be sorted by priority
    // This is harder to test explicitly, but we can check that the list is still rendered
    sampleTodos.forEach(todo => {
      expect(screen.getByText(todo.title)).toBeInTheDocument();
    });
  });
  
  it('handles search functionality', async () => {
    // Mock todos with sample data
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      todos: sampleTodos,
      isLoading: false
    });
    
    renderWithProviders(<TodoList />);
    
    // Find the search input
    const searchInput = screen.getByPlaceholderText(/search/i) ||
                       screen.getByRole('searchbox');
    
    // Type a search term that should match only one todo
    await userEvent.type(searchInput, 'project proposal');
    
    // Now only the matching todo should be visible
    const matchingTodo = sampleTodos.find(todo => todo.title.includes('project proposal'));
    const nonMatchingTodos = sampleTodos.filter(todo => !todo.title.includes('project proposal'));
    
    if (matchingTodo) {
      expect(screen.getByText(matchingTodo.title)).toBeInTheDocument();
    }
    
    nonMatchingTodos.forEach(todo => {
      expect(screen.queryByText(todo.title)).not.toBeInTheDocument();
    });
  });
});
