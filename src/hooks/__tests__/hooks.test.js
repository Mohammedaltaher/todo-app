import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../useLocalStorage';
import useSavingIndicator from '../useSavingIndicator';

// Mock the localStorage API
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Mock the saving indicator element
const mockSavingIndicator = {
  className: '',
  classList: {
    add: function(cls) { this._el.className += (this._el.className ? ' ' : '') + cls; },
    remove: function(cls) { this._el.className = this._el.className.replace(new RegExp('\\b' + cls + '\\b', 'g'), '').trim(); },
    _el: null
  }
};
mockSavingIndicator.classList._el = mockSavingIndicator;

describe('Custom Hooks', () => {
  describe('useLocalStorage', () => {
    beforeEach(() => {
      // Setup localStorage mock
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      localStorageMock.clear();
      vi.clearAllMocks();
    });
    
    it('initializes with the initial value when no stored value exists', () => {
      // Initial test data
      const key = 'testKey';
      const initialValue = { test: 'initialValue' };
      
      // Render the hook
      const { result } = renderHook(() => useLocalStorage(key, initialValue));
      
      // Test initial value
      expect(result.current[0]).toEqual(initialValue);
      // Verify localStorage was checked for existing value
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
    });
    
    it('initializes with stored value when it exists', () => {
      // Setup test data
      const key = 'testKey';
      const initialValue = { test: 'initialValue' };
      const storedValue = { test: 'storedValue' };
      
      // Mock a stored value
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(storedValue));
      
      // Render the hook
      const { result } = renderHook(() => useLocalStorage(key, initialValue));
      
      // Test that stored value was used
      expect(result.current[0]).toEqual(storedValue);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
    });
    
    it('updates the stored value when setValue is called', () => {
      // Setup test data
      const key = 'testKey';
      const initialValue = { test: 'initialValue' };
      const newValue = { test: 'newValue' };
      
      // Render the hook
      const { result } = renderHook(() => useLocalStorage(key, initialValue));
      
      // Update the value
      act(() => {
        result.current[1](newValue);
      });
      
      // Check that value was updated and stored
      expect(result.current[0]).toEqual(newValue);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(newValue));
    });
    
    it('handles function updates correctly', () => {
      // Setup test data
      const key = 'testKey';
      const initialValue = { count: 0 };
      
      // Render the hook
      const { result } = renderHook(() => useLocalStorage(key, initialValue));
      
      // Update with a function
      act(() => {
        result.current[1](prev => ({ count: prev.count + 1 }));
      });
      
      // Check for correct update
      expect(result.current[0]).toEqual({ count: 1 });
      expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify({ count: 1 }));
    });
  });
  
  describe('useSavingIndicator', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      
      // Mock DOM elements
      document.getElementById = vi.fn().mockImplementation(id => {
        if (id === 'saving-indicator') {
          return mockSavingIndicator;
        }
        return null;
      });
      
      // Reset the indicator state
      mockSavingIndicator.className = '';
    });
    
    it('shows the saving indicator when saving is triggered', () => {
      const { result } = renderHook(() => useSavingIndicator());
      
      // Trigger saving state
      act(() => {
        result.current.showSaving();
      });
      
      // Check that the indicator has the 'visible' class
      expect(mockSavingIndicator.className).toContain('visible');
    });
    
    it('hides the saving indicator after the specified duration', () => {
      // Mock setTimeout
      vi.useFakeTimers();
      
      const { result } = renderHook(() => useSavingIndicator());
      
      // Trigger saving state
      act(() => {
        result.current.showSaving();
      });
      
      // Check that the indicator is visible
      expect(mockSavingIndicator.className).toContain('visible');
      
      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(2000); // Default duration is 2000ms
      });
      
      // Check that the indicator is now hidden
      expect(mockSavingIndicator.className).not.toContain('visible');
      
      // Restore setTimeout
      vi.useRealTimers();
    });
    
    it('allows custom duration for showing the indicator', () => {
      // Mock setTimeout
      vi.useFakeTimers();
      
      const customDuration = 5000; // 5 seconds
      const { result } = renderHook(() => useSavingIndicator());
      
      // Trigger saving state with custom duration
      act(() => {
        result.current.showSaving(customDuration);
      });
      
      // Check that the indicator is visible
      expect(mockSavingIndicator.className).toContain('visible');
      
      // Fast-forward time but not enough
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      // Should still be visible
      expect(mockSavingIndicator.className).toContain('visible');
      
      // Fast-forward to complete duration
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      // Now it should be hidden
      expect(mockSavingIndicator.className).not.toContain('visible');
      
      // Restore setTimeout
      vi.useRealTimers();
    });
  });
});
