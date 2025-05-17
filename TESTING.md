# Testing Documentation

This document describes the testing strategy and procedures for the Todo App.

## Test Structure

The application uses Vitest as the test runner with React Testing Library for component testing.

### New Component-Based Test Structure

Tests are now organized in a component-based structure, with tests located alongside the code they test:

```
src/
  components/
    Button.jsx
    __tests__/
      Button.test.jsx
  pages/
    HomePage.jsx
    __tests__/
      HomePage.test.jsx
  context/
    TodoContext.jsx
    __tests__/
      TodoContext.test.jsx
  hooks/
    useLocalStorage.js
    __tests__/
      hooks.test.js
```

### Types of Tests

- **Unit Tests**: Test individual UI components, hooks, and utilities in isolation
- **Integration Tests**: Test multiple components working together
- **Context Tests**: Test the TodoContext provider and its functions

## Running Tests

You can run the tests using the following npm scripts:

```bash
# Run all tests once
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Generate a coverage report
npm run test:coverage
```

## Test Files

- `components/__tests__/Button.test.jsx`: Tests for the Button component
- `components/__tests__/Header.test.jsx`: Tests for the Header component
- `context/__tests__/TodoContext.test.jsx`: Tests for the TodoContext provider
- `components/__tests__/TodoForm.test.jsx`: Tests for the TodoForm component
- `components/__tests__/TodoItem.test.jsx`: Tests for the TodoItem component
- `components/__tests__/TodoList.test.jsx`: Tests for the TodoList component
- `hooks/__tests__/hooks.test.js`: Tests for custom hooks
- `pages/__tests__/HomePage.test.jsx`: Tests for the HomePage component

## Writing New Tests

When writing new tests:

1. Create the test file in the appropriate `__tests__` directory next to the code being tested
2. Use the `renderWithProviders` helper from `utils/test-utils.jsx` to render components with context providers
3. For context-dependent components, mock the context values
4. Test both the rendered UI and the component behavior

## Mocking

- The tests use mocked versions of `localStorage` to avoid actual storage interactions
- Context functions like `addTodo` and `toggleTodo` are mocked when testing components
- The `useSavingIndicator` hook has DOM element mocks to simulate the saving indicator

## Benefits of Component-Based Test Structure

1. **Co-location**: Tests are near the code they test, making it easier to find and update them together
2. **Component Focus**: Each test file focuses on a specific component or feature
3. **Maintainability**: When a component changes, its tests are immediately visible
4. **Scalability**: As the application grows, the test structure scales naturally
