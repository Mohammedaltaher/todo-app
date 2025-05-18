// src/hooks/useDragDrop.js
import { useCallback } from 'react';
import { useTodos } from '../context/TodoContext';

/**
 * Custom hook for drag and drop functionality
 */
const useDragDrop = () => {
  const { reorderTodos } = useTodos();
  
  /**
   * Handle the end of a drag operation
   * @param {Object} result - Result object from react-beautiful-dnd
   */
  const onDragEnd = useCallback((result) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }
    
    // If position didn't change
    if (result.destination.index === result.source.index) {
      return;
    }
    
    // Call the reorder function from TodoContext
    reorderTodos(result.source.index, result.destination.index);
  }, [reorderTodos]);
  
  return {
    onDragEnd
  };
};

export default useDragDrop;
