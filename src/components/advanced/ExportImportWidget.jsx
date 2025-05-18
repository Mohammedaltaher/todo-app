// src/components/advanced/ExportImportWidget.jsx
import React, { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import { Button } from '../Button';

const ExportImportWidget = () => {
  const { todos, importTodos } = useTodos();
  const [importError, setImportError] = useState(null);
  
  const handleExport = (format) => {
    // Get the exported data
    const data = format === 'json' 
      ? JSON.stringify(todos, null, 2)
      : convertToCSV(todos);
    
    // Create a blob and download
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todos.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    const isJSON = file.name.endsWith('.json');
    
    reader.onload = (e) => {
      try {
        let importedTodos;
        
        if (isJSON) {
          importedTodos = JSON.parse(e.target.result);
        } else {
          // Assume CSV
          importedTodos = parseCSV(e.target.result);
        }
        
        importTodos(importedTodos);
        setImportError(null);
      } catch (error) {
        setImportError(`Error importing file: ${error.message}`);
      }
    };
    
    reader.readAsText(file);
    // Clear the input
    event.target.value = null;
  };
  
  // Helper to convert todos to CSV
  const convertToCSV = (todos) => {
    // CSV header
    const header = 'id,title,description,completed,createdAt,dueDate,priority,tags\n';
    
    // Convert each todo to a CSV row
    const rows = todos.map(todo => {
      return [
        todo.id,
        `"${todo.title.replace(/"/g, '""')}"`,
        `"${(todo.description || '').replace(/"/g, '""')}"`,
        todo.completed,
        todo.createdAt,
        todo.dueDate || '',
        todo.priority || 'medium',
        `"${(todo.tags || []).join(',').replace(/"/g, '""')}"`
      ].join(',');
    }).join('\n');
    
    return header + rows;
  };
  
  // Helper to parse CSV to todos
  const parseCSV = (csv) => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',');
      const todo = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        if (header === 'completed') {
          todo[header] = value === 'true';
        } else if (header === 'tags' && value) {
          todo[header] = value.replace(/^"|"$/g, '').split(',').map(tag => tag.trim());
        } else {
          todo[header] = value ? value.replace(/^"|"$/g, '') : '';
        }
      });
      
      return todo;
    });
  };
  
  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold mb-4">Export/Import</h3>
      
      {importError && (
        <div className="bg-red-50 text-red-600 p-2 rounded mb-4 text-sm">
          {importError}
        </div>
      )}
      
      <div className="flex flex-col space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Export Tasks
          </label>
          <div className="flex space-x-2">
            <Button
              onClick={() => handleExport('json')}
              variant="outline"
              className="text-sm"
            >
              Export JSON
            </Button>
            <Button
              onClick={() => handleExport('csv')}
              variant="outline"
              className="text-sm"
            >
              Export CSV
            </Button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Import Tasks
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleImport}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JSON, CSV
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExportImportWidget;
