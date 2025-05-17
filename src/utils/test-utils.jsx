import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TodoProvider } from '../context/TodoContext';

// Custom render function that includes providers
export function renderWithProviders(ui, options = {}) {
  // If the component is App, don't wrap with BrowserRouter again
  const isAppComponent = ui && (ui.type && (ui.type.name === 'App' || ui.type.displayName === 'App'));
  const Wrapper = ({ children }) => (
    isAppComponent
      ? <TodoProvider>{children}</TodoProvider>
      : <BrowserRouter><TodoProvider>{children}</TodoProvider></BrowserRouter>
  );
  return render(ui, { wrapper: Wrapper, ...options });
}

// Sample todo items for testing
export const sampleTodos = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the project proposal for the client',
    dueDate: new Date().toISOString(),
    priority: 'high',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Add more sample todos as needed
];
