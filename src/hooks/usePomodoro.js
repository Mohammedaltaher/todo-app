// src/hooks/usePomodoro.js
import { useState, useEffect, useCallback, useRef } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Custom hook for Pomodoro timer functionality
 */
const usePomodoro = () => {
  // Store settings in localStorage
  const [settings, setSettings] = useLocalStorage('pomodoroSettings', {
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    roundsBeforeLongBreak: 4
  });
  
  // Timer state
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [secondsLeft, setSecondsLeft] = useState(settings.workMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedRounds, setCompletedRounds] = useState(0);
  const intervalRef = useRef(null);
  
  // Calculate the current timer's total seconds
  const getTotalSeconds = useCallback(() => {
    switch (mode) {
      case 'work':
        return settings.workMinutes * 60;
      case 'shortBreak':
        return settings.shortBreakMinutes * 60;
      case 'longBreak':
        return settings.longBreakMinutes * 60;
      default:
        return settings.workMinutes * 60;
    }
  }, [mode, settings]);
  
  // Calculate progress percentage
  const progressPercentage = useCallback(() => {
    const totalSeconds = getTotalSeconds();
    return ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  }, [secondsLeft, getTotalSeconds]);
  
  // Move to the next mode
  const nextMode = useCallback(() => {
    // If current mode is work
    if (mode === 'work') {
      // Increment completed rounds
      const newCompletedRounds = completedRounds + 1;
      setCompletedRounds(newCompletedRounds);
      
      // Check if long break is due
      if (newCompletedRounds % settings.roundsBeforeLongBreak === 0) {
        setMode('longBreak');
        setSecondsLeft(settings.longBreakMinutes * 60);
      } else {
        setMode('shortBreak');
        setSecondsLeft(settings.shortBreakMinutes * 60);
      }
    } else {
      // If current mode is a break, go back to work
      setMode('work');
      setSecondsLeft(settings.workMinutes * 60);
    }
    
    // Stop the timer when switching modes
    setIsActive(false);
  }, [mode, completedRounds, settings]);
  
  // Start the timer
  const startTimer = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
    }
  }, [isActive]);
  
  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (isActive) {
      setIsActive(false);
    }
  }, [isActive]);
  
  // Reset the timer to its initial state for the current mode
  const resetTimer = useCallback(() => {
    setIsActive(false);
    
    switch (mode) {
      case 'work':
        setSecondsLeft(settings.workMinutes * 60);
        break;
      case 'shortBreak':
        setSecondsLeft(settings.shortBreakMinutes * 60);
        break;
      case 'longBreak':
        setSecondsLeft(settings.longBreakMinutes * 60);
        break;
      default:
        setSecondsLeft(settings.workMinutes * 60);
    }
  }, [mode, settings]);
  
  // Skip to the next mode
  const skipToNext = useCallback(() => {
    nextMode();
  }, [nextMode]);
  
  // Timer effect
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            
            // Move to next mode when timer finishes
            nextMode();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, nextMode]);
  
  return {
    secondsLeft,
    isActive,
    mode,
    completedRounds,
    settings,
    progressPercentage,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToNext
  };
};

export default usePomodoro;
