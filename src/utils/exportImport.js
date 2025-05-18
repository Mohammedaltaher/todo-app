// src/utils/exportImport.js
import csvtojson from 'csvtojson';

/**
 * Custom CSV generator to replace json2csv dependency
 * @param {Array} data - Array of objects to convert to CSV
 * @param {Array} fields - Array of field names to include
 * @returns {string} CSV formatted string
 */
const generateCSV = (data, fields) => {
  // Handle empty data
  if (!data || !data.length) return '';
  
  // Create the header row
  const header = fields.join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return fields.map(field => {
      // Get value, handle undefined/null
      const value = item[field] !== undefined && item[field] !== null ? item[field] : '';
      
      // Handle strings with commas or quotes by wrapping in quotes and escaping existing quotes
      if (typeof value === 'string') {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }
      
      // Handle other types
      return String(value);
    }).join(',');
  });
  
  // Combine header and rows
  return [header, ...rows].join('\n');
};

/**
 * Export todos to a CSV string
 * @param {Array} todos - Array of todo objects
 * @returns {string} CSV formatted string
 */
export const exportToCSV = (todos) => {
  try {
    // Define fields to include in export
    const fields = [
      'id',
      'title',
      'description',
      'dueDate',
      'priority',
      'completed',
      'createdAt',
      'updatedAt',
      'tags',
      'isRecurring',
      'recurrencePattern',
      'parentId'
    ];
    
    // Process todos to ensure proper format for CSV
    const processedTodos = todos.map(todo => ({
      ...todo,
      // Convert arrays and objects to strings
      tags: todo.tags ? JSON.stringify(todo.tags) : '',
      recurrencePattern: todo.recurrencePattern ? JSON.stringify(todo.recurrencePattern) : '',
    }));
    
    // Convert to CSV using our custom function
    return generateCSV(processedTodos, fields);
  } catch (err) {
    console.error('Error exporting to CSV:', err);
    throw new Error('Failed to export todos to CSV');
  }
};

/**
 * Export todos to a JSON string
 * @param {Array} todos - Array of todo objects
 * @returns {string} JSON formatted string
 */
export const exportToJSON = (todos) => {
  try {
    return JSON.stringify(todos, null, 2);
  } catch (err) {
    console.error('Error exporting to JSON:', err);
    throw new Error('Failed to export todos to JSON');
  }
};

/**
 * Import todos from a CSV string
 * @param {string} csvString - CSV formatted string 
 * @returns {Promise<Array>} Promise resolving to array of todos
 */
export const importFromCSV = async (csvString) => {
  try {
    const todos = await csvtojson().fromString(csvString);
    
    // Process todos to restore proper data types
    return todos.map(todo => ({
      ...todo,
      // Convert string representations back to objects
      tags: todo.tags ? JSON.parse(todo.tags) : [],
      recurrencePattern: todo.recurrencePattern ? JSON.parse(todo.recurrencePattern) : null,
      // Ensure boolean types
      completed: todo.completed === 'true' || todo.completed === true,
      isRecurring: todo.isRecurring === 'true' || todo.isRecurring === true,
    }));
  } catch (err) {
    console.error('Error importing from CSV:', err);
    throw new Error('Failed to import todos from CSV');
  }
};

/**
 * Import todos from a JSON string
 * @param {string} jsonString - JSON formatted string
 * @returns {Array} Array of todo objects
 */
export const importFromJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('Error importing from JSON:', err);
    throw new Error('Failed to import todos from JSON');
  }
};
