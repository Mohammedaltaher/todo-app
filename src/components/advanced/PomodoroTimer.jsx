// src/components/advanced/PomodoroTimer.jsx
import { useState, useEffect } from 'react';
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
  
  const [animate, setAnimate] = useState(false);
  
  // Animation effect
  useEffect(() => {
    if (isActive) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [isActive]);
  
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
        return 'from-red-500 to-orange-500';
      case 'shortBreak':
        return 'from-green-500 to-teal-500';
      case 'longBreak':
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-indigo-500 to-purple-500';
    }
  };  
  // Calculate the perimeter of the circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercentage() / 100 * circumference);
  
  // Get mode display name
  const getModeDisplayName = () => {
    switch (mode) {
      case 'work':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Pomodoro';
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Pomodoro Timer</h3>
      
      {/* Timer Circle */}
      <div className="relative my-6">
        {/* Background circle */}
        <svg width="170" height="170" viewBox="0 0 170 170" className="transform -rotate-90">
          <circle 
            cx="85" 
            cy="85" 
            r={radius} 
            fill="none" 
            stroke="#f1f1f1" 
            strokeWidth="12"
          />
          
          {/* Progress circle */}
          <circle 
            cx="85" 
            cy="85" 
            r={radius} 
            fill="none" 
            stroke={`url(#${mode}Gradient)`} 
            strokeWidth="12" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-500 ${animate ? 'ease-linear' : 'ease-out'}`}
          />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="workGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="shortBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            <linearGradient id="longBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Time and Mode Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-800">
            {formatTime(secondsLeft)}
          </div>
          <div className={`text-sm font-medium mt-1 bg-gradient-to-r ${getModeColor()} bg-clip-text text-transparent`}>
            {getModeDisplayName()}
          </div>
        </div>
      </div>
      
      {/* Timer Controls */}
      <div className="flex justify-center gap-3 mt-4">
        {!isActive ? (
          <Button 
            onClick={startTimer}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-300"
            size="sm"
          >
            Start
          </Button>
        ) : (
          <Button 
            onClick={pauseTimer}
            className="px-5 py-2 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
            size="sm"
          >
            Pause
          </Button>
        )}
        
        <Button 
          onClick={resetTimer}
          className="px-5 py-2 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
          size="sm"
        >
          Reset
        </Button>
        
        <Button 
          onClick={skipToNext}
          className="px-5 py-2 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
          size="sm"
        >
          Skip
        </Button>
      </div>
      
      {/* Session customization */}
      <div className="mt-6 w-full">
        <div className="text-sm text-gray-500 mb-2 flex justify-between items-center">
          <span>Customize Sessions</span>
          <button className="text-indigo-500 hover:text-indigo-700 text-xs">Settings</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-red-50 rounded-lg p-2 text-center">
            <div className="text-xs text-red-600 font-medium">Focus</div>
            <div className="text-sm font-bold text-gray-700">25:00</div>
          </div>
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <div className="text-xs text-green-600 font-medium">Short</div>
            <div className="text-sm font-bold text-gray-700">05:00</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <div className="text-xs text-blue-600 font-medium">Long</div>
            <div className="text-sm font-bold text-gray-700">15:00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
