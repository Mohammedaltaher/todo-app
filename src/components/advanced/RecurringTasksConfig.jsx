// src/components/advanced/RecurringTasksConfig.jsx
import React from 'react';

const RecurringTasksConfig = ({ config, onChange }) => {
  const handleFrequencyChange = (e) => {
    onChange({
      ...config,
      frequency: e.target.value
    });
  };

  const handleIntervalChange = (e) => {
    onChange({
      ...config,
      interval: parseInt(e.target.value, 10) || 1
    });
  };

  const handleEndDateChange = (e) => {
    onChange({
      ...config,
      endDate: e.target.value
    });
  };

  const handleDayOfWeekToggle = (day) => {
    // Clone the current days array
    const newDays = [...(config.daysOfWeek || [])];
    
    // Add or remove the day
    if (newDays.includes(day)) {
      const index = newDays.indexOf(day);
      newDays.splice(index, 1);
    } else {
      newDays.push(day);
      newDays.sort((a, b) => a - b);
    }
    
    onChange({
      ...config,
      daysOfWeek: newDays
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Repeat Frequency
        </label>
        <select
          value={config.frequency}
          onChange={handleFrequencyChange}
          className="input w-full"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {config.frequency === 'daily' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Repeat every
          </label>
          <div className="flex items-center">
            <input
              type="number"
              min="1"
              max="365"
              value={config.interval}
              onChange={handleIntervalChange}
              className="input w-20 mr-2"
            />
            <span className="text-sm text-gray-600">day(s)</span>
          </div>
        </div>
      )}

      {config.frequency === 'weekly' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Repeat on
          </label>
          <div className="flex flex-wrap gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <button
                key={index}
                type="button"
                className={`w-8 h-8 rounded-full text-sm font-medium ${
                  config.daysOfWeek?.includes(index)
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleDayOfWeekToggle(index)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Date (optional)
        </label>
        <input
          type="date"
          value={config.endDate || ''}
          onChange={handleEndDateChange}
          className="input w-full"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
    </div>
  );
};

export default RecurringTasksConfig;