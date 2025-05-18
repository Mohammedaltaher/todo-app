import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import './components/advanced/Advanced.css';
import { TodoProvider } from './context/TodoContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <TodoProvider>
        <AppRoutes />
      </TodoProvider>
    </BrowserRouter>
  );
}

export default App;