// src/hooks/useSavingIndicator.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to show a saving indicator
 * @param {number} delay - Delay in ms before the indicator automatically hides
 * @returns {[boolean, Function]} - A stateful value for the saving state and a function to show the indicator
 */
function useSavingIndicator(delay = 800) {
  const [isSaving, setIsSaving] = useState(false);
  
  const showSavingIndicator = useCallback(() => {
    setIsSaving(true);
    
    const indicator = document.getElementById('saving-indicator');
    if (indicator) {
      indicator.classList.add('saving-indicator-show');
    }
  }, []);
  
  const hideSavingIndicator = useCallback(() => {
    setIsSaving(false);
    
    const indicator = document.getElementById('saving-indicator');
    if (indicator) {
      indicator.classList.remove('saving-indicator-show');
    }
  }, []);
  
  const save = useCallback(async (callback) => {
    showSavingIndicator();
    try {
      await new Promise((resolve) => setTimeout(resolve, delay));
      if (callback) {
        await callback();
      }
    } catch (err) {
      hideSavingIndicator();
      throw err;
    }
    hideSavingIndicator();
  }, [delay, showSavingIndicator, hideSavingIndicator]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      hideSavingIndicator();
    };
  }, [hideSavingIndicator]);
  
  return [isSaving, save];
}

export default useSavingIndicator;
