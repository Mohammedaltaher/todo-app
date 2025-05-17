# Todo App

A modern, responsive todo application built with React, React Router, and Tailwind CSS.

## Features

- Create, edit, and delete tasks
- Set due dates and priority levels
- Filter tasks by status (all, active, completed)
- Sort tasks by creation date or due date
- Persistent storage using localStorage
- Responsive design for all device sizes

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Previews the production build
- `npm run lint` - Runs ESLint
- `npm test` - Runs all tests
- `npm run test:watch` - Runs tests in watch mode
- `npm run test:coverage` - Generates a coverage report

## Testing

The application has a comprehensive test suite using Vitest and React Testing Library. See [TESTING.md](./TESTING.md) for details on the testing strategy and procedures.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Project Structure

```
todo-app/
├── public/            # Static files
├── src/
│   ├── assets/        # Images, icons, etc.
│   ├── components/    # UI components
│   ├── context/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Page layouts
│   ├── pages/         # Page components
│   ├── routes/        # Routing configuration
│   ├── styles/        # CSS styles and themes
│   ├── test/          # Tests
│   └── utils/         # Utility functions
├── App.jsx            # Main app component
└── main.jsx           # Entry point
```

## Technologies Used

- React 19
- React Router 7
- Tailwind CSS
- Vitest & React Testing Library
- localStorage for persistence

## License

This project is licensed under the MIT License - see the LICENSE file for details.
