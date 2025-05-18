import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Header from '../Header';
import { renderWithProviders, sampleTodos } from '../../utils/test-utils';
import * as TodoContext from '../../context/TodoContext';

describe('Header Component', () => {
  beforeEach(() => {
    // Mock Math.random for predictable greeting selection
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('renders the header with the date and task counts', () => {
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
    
    // Verify the task count from our sample data
    const pendingCount = sampleTodos.filter(todo => !todo.completed).length;
    const completedCount = sampleTodos.filter(todo => todo.completed).length;
    
    // Check for the pending and completed count elements
    expect(screen.getByText(pendingCount.toString())).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText(completedCount.toString())).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
  });
  
  it('renders the app title and random greeting', () => {
    vi.spyOn(TodoContext, 'useTodos').mockReturnValue({
      todos: []
    });
    
    renderWithProviders(<Header />);
    
    // Check for app title
    expect(screen.getByText('Task Master')).toBeInTheDocument();
    
    // Check for the random greeting (we've mocked Math.random to return 0, so it should be the first greeting)
    const greetings = [
      "Let's get things done!",
      "Ready to be productive?",
      "What's on your plate today?",
      "Plan your day for success!",
      "Focus on what matters today."
    ];
    
    expect(screen.getByText(greetings[0])).toBeInTheDocument();
  });
});
