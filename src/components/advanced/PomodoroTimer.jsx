// src/components/advanced/PomodoroTimer.jsx
import { useState } from 'react';
import usePomodoro from '../../hooks/usePomodoro';
import { Button } from '../Button';

const PomodoroTimer = () => {
  const {
    isActive,
    secondsLeft,
    mode,
    progressPercentage,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToNext
  } = usePomodoro();
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get color based on current mode
  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return 'var(--color-pomodoro-work)';
      case 'shortBreak':
        return 'var(--color-pomodoro-break)';
      case 'longBreak':
        return 'var(--color-pomodoro-long-break)';
      default:
        return 'var(--color-primary)';
    }
  };
  
  return (
    <div className="pomodoro-container">
      <h3 className="text-lg font-semibold mb-2">Pomodoro Timer</h3>
      
      <div 
        className="pomodoro-progress" 
        role="progressbar" 
        aria-valuenow={progressPercentage()} 
        aria-valuemin="0" 
        aria-valuemax="100"
      >
        <div 
          className="pomodoro-progress-bar" 
          style={{ 
            width: `${progressPercentage()}%`,
            backgroundColor: getModeColor()
          }}
        ></div>
      </div>
      
      <div className="pomodoro-state">
        {mode === 'work' ? 'Work session' : mode === 'shortBreak' ? 'Short break' : 'Long break'}
      </div>
      
      <div className="pomodoro-timer">
        {formatTime(secondsLeft)}
      </div>
      
      <div className="flex justify-center space-x-2 mt-4">
        {!isActive ? (
          <Button 
            onClick={startTimer}
            variant="default"
            size="sm"
          >
            Start
          </Button>
        ) : (
          <Button 
            onClick={pauseTimer}
            variant="outline"
            size="sm"
          >
            Pause
          </Button>
        )}
        
        <Button 
          onClick={resetTimer}
          variant="outline"
          size="sm"
        >
          Reset
        </Button>
        
        <Button 
          onClick={skipToNext}
          variant="outline"
          size="sm"
        >
          Skip
        </Button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
