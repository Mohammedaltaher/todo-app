# Todo App Testing Suite

This directory contains test setup files for the Todo App, while the actual tests are now organized in `__tests__` directories alongside the components, hooks, context providers, and pages they test.

## New Test Structure

Tests have been moved from this central directory to a component-based structure:

1. **Component Tests**: Located in `src/components/__tests__/`
2. **Page Tests**: Located in `src/pages/__tests__/`
3. **Context Tests**: Located in `src/context/__tests__/`
4. **Hook Tests**: Located in `src/hooks/__tests__/`

## Running Tests

You can run tests with these commands:

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate a coverage report
npm run test:coverage
```

## Test Files

Tests are now organized alongside the code they're testing:

- **Button Component**: `src/components/__tests__/Button.test.jsx`
- **Header Component**: `src/components/__tests__/Header.test.jsx`
- **HomePage**: `src/pages/__tests__/HomePage.test.jsx`
- **Custom Hooks**: `src/hooks/__tests__/hooks.test.js`
- **TodoContext**: `src/context/__tests__/TodoContext.test.jsx`
- **TodoForm Component**: `src/components/__tests__/TodoForm.test.jsx`
- **TodoItem Component**: `src/components/__tests__/TodoItem.test.jsx`
- **TodoList Component**: `src/components/__tests__/TodoList.test.jsx`

## Writing Tests

When writing new tests:

1. Create the test file in the appropriate `__tests__` directory next to the code being tested
2. Use the `renderWithProviders` helper from `src/utils/test-utils.jsx` for components that use context
3. Mock context values when necessary
4. Test both UI elements and component behavior

## Test Utilities

The `src/utils/test-utils.jsx` file provides:

- The `renderWithProviders` helper for rendering components with context
- Sample todo data for consistent testing

## Tips

- Run tests in watch mode during development
- Fix test failures before moving on to writing new tests
- Maintain test isolation to avoid interdependencies
- Mock external dependencies like localStorage
