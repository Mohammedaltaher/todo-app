// src/components/advanced/ExportImport.jsx
import { useState } from 'react';
import { useTodos } from '../../context/TodoContext';

const ExportImport = () => {
  const { exportTodos, importTodos } = useTodos();
  const [importFormat, setImportFormat] = useState('json');
  const [importStrategy, setImportStrategy] = useState('merge');
  const [importFile, setImportFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  
  // Handle export
  const handleExport = (format) => {
    try {
      // Get exported data
      const data = exportTodos(format);
      
      // Create a blob and download link
      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create and click a download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `todos_export.${format}`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export failed: ${error.message}`);
    }
  };
  
  // Handle file input change
  const handleFileChange = (e) => {
    setImportFile(e.target.files[0]);
    setImportResult(null);
  };
  
  // Handle import
  const handleImport = async () => {
    if (!importFile) {
      alert('Please select a file to import');
      return;
    }
    
    try {
      setIsImporting(true);
      
      // Read the file
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const fileContent = e.target.result;
          
          // Import the todos
          const importCount = await importTodos(fileContent, importFormat, importStrategy);
          
          setImportResult({
            success: true,
            message: `Successfully imported ${importCount} todos.`
          });
        } catch (error) {
          console.error('Import processing error:', error);
          setImportResult({
            success: false,
            message: `Import failed: ${error.message}`
          });
        } finally {
          setIsImporting(false);
        }
      };
      
      reader.onerror = () => {
        setImportResult({
          success: false,
          message: 'Failed to read the file'
        });
        setIsImporting(false);
      };
      
      reader.readAsText(importFile);
    } catch (error) {
      console.error('Import error:', error);
      setImportResult({
        success: false,
        message: `Import failed: ${error.message}`
      });
      setIsImporting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="text-lg font-medium mb-4">Import & Export</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div>
          <h4 className="text-md font-medium mb-2">Export Todos</h4>
          <p className="text-sm text-gray-600 mb-4">
            Export your todos to a file for backup or transfer.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={() => handleExport('json')}
              className="px-3 py-2 text-sm bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-dark)]"
            >
              Export as JSON
            </button>
            
            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Export as CSV
            </button>
          </div>
        </div>
        
        {/* Import Section */}
        <div>
          <h4 className="text-md font-medium mb-2">Import Todos</h4>
          <p className="text-sm text-gray-600 mb-4">
            Import todos from a previously exported file.
          </p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">File Format</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="json"
                    checked={importFormat === 'json'}
                    onChange={() => setImportFormat('json')}
                    className="mr-2"
                  />
                  <span>JSON</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="csv"
                    checked={importFormat === 'csv'}
                    onChange={() => setImportFormat('csv')}
                    className="mr-2"
                  />
                  <span>CSV</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Import Strategy</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="merge"
                    checked={importStrategy === 'merge'}
                    onChange={() => setImportStrategy('merge')}
                    className="mr-2"
                  />
                  <span>Merge</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="replace"
                    checked={importStrategy === 'replace'}
                    onChange={() => setImportStrategy('replace')}
                    className="mr-2"
                  />
                  <span>Replace All</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">File</label>
              <input
                type="file"
                accept={importFormat === 'csv' ? '.csv' : '.json'}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-gray-100 file:text-gray-700
                  hover:file:bg-gray-200"
              />
            </div>
            
            <div>
              <button
                onClick={handleImport}
                disabled={!importFile || isImporting}
                className={`px-4 py-2 text-sm rounded-md ${
                  !importFile || isImporting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
                }`}
              >
                {isImporting ? 'Importing...' : 'Import'}
              </button>
            </div>
            
            {importResult && (
              <div className={`mt-3 p-3 text-sm rounded-md ${
                importResult.success
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {importResult.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportImport;
