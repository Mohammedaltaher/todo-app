// Utility functions for interacting with localStorage

/**
 * Load data from localStorage
 * @param {string} key - The key to retrieve data for
 * @returns {any|null} - The parsed data or null if not found
 */
export const loadFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

/**
 * Save data to localStorage with visual indicator
 * @param {string} key - The key to save data under
 * @param {any} data - The data to save
 * @param {number} delay - Optional delay in ms before completing save (for visual feedback)
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const saveToLocalStorage = (key, data, delay = 800) => {
  return new Promise((resolve) => {
    try {
      // Show saving indicator
      toggleSavingIndicator(true);
      
      // Simulate network delay for better UX
      setTimeout(() => {
        localStorage.setItem(key, JSON.stringify(data));
        toggleSavingIndicator(false);
        resolve(true);
      }, delay);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toggleSavingIndicator(false);
      resolve(false);
    }
  });
};

/**
 * Toggle the saving indicator visibility
 * @param {boolean} show - Whether to show or hide the indicator
 */
export const toggleSavingIndicator = (show) => {
  const indicator = document.getElementById('saving-indicator');
  if (!indicator) return; // Safely handle case when indicator doesn't exist
  
  if (show) {
    indicator.classList.add('saving-indicator-show');
  } else {
    indicator.classList.remove('saving-indicator-show');
  }
};
