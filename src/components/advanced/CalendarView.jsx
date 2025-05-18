// src/components/advanced/CalendarView.jsx
import { useState } from 'react';
import Calendar from 'react-calendar';
import TodoItem from '../TodoItem';
import { useTodos } from '../../context/TodoContext';
import useCalendar from '../../hooks/useCalendar.jsx';
import * as Tabs from '@radix-ui/react-tabs';
import 'react-calendar/dist/Calendar.css';

const CalendarView = () => {
  const { todos } = useTodos();
  const { 
    selectedDate, 
    setSelectedDate, 
    viewMode, 
    setViewMode,
    getTodosForDate,
    getMonthTodos,
    getWeekTodos,
    getTileContent,
    getTileClassName
  } = useCalendar();
  
  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  // Get todos for selected date
  const selectedDateTodos = getTodosForDate(selectedDate);
  
  // Format the selected date for display
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get month and week data
  const monthData = getMonthTodos();
  const weekData = getWeekTodos();
  
  return (
    <div className="space-y-6">
      <Tabs.Root defaultValue="month" onValueChange={setViewMode}>
        <Tabs.List className="flex border-b mb-4">
          <Tabs.Trigger 
            value="month" 
            className="px-4 py-2 text-sm font-medium focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]"
          >
            Month
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="week" 
            className="px-4 py-2 text-sm font-medium focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]"
          >
            Week
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="day" 
            className="px-4 py-2 text-sm font-medium focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-primary)]"
          >
            Day
          </Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="month" className="focus:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 bg-white">
              <Calendar 
                onChange={handleDateChange} 
                value={selectedDate}
                tileContent={getTileContent}
                tileClassName={getTileClassName}
                className="w-full border-none"
              />
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">{formattedDate}</h3>
              
              {selectedDateTodos.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateTodos.map(todo => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tasks scheduled for this day.</p>
              )}
            </div>
          </div>
        </Tabs.Content>
        
        <Tabs.Content value="week" className="focus:outline-none">
          <h3 className="text-xl font-medium mb-4">Week View</h3>
          
          <div className="grid grid-cols-7 gap-2">
            {Object.entries(weekData).map(([dateStr, todos]) => {
              const date = new Date(dateStr);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = date.getDate();
              
              return (
                <div 
                  key={dateStr} 
                  className={`border rounded-md p-3 min-h-[12rem] bg-white hover:border-[var(--color-primary)] cursor-pointer ${
                    date.toDateString() === selectedDate.toDateString() ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]' : ''
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="font-medium mb-2 text-center">
                    <div className="text-sm text-gray-600">{dayName}</div>
                    <div className={`text-lg ${date.toDateString() === new Date().toDateString() ? 'bg-[var(--color-primary)] text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto' : ''}`}>
                      {dayNum}
                    </div>
                  </div>
                  
                  <div className="space-y-1 mt-3">
                    {todos.length > 0 ? (
                      todos.slice(0, 3).map(todo => (
                        <div key={todo.id} className="text-xs p-1 rounded bg-gray-50 truncate border-l-2 border-[var(--color-primary)]">
                          {todo.title}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400 italic">No tasks</div>
                    )}
                    {todos.length > 3 && (
                      <div className="text-xs text-gray-500 text-center mt-1">
                        {`+${todos.length - 3} more`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Tabs.Content>
        
        <Tabs.Content value="day" className="focus:outline-none">
          <div>
            <h3 className="text-xl font-medium mb-4">{formattedDate}</h3>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => {
                  const prevDay = new Date(selectedDate);
                  prevDay.setDate(prevDay.getDate() - 1);
                  setSelectedDate(prevDay);
                }}
                className="px-3 py-1 text-sm rounded border hover:bg-gray-50"
              >
                Previous Day
              </button>
              
              <button 
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-1 text-sm rounded border hover:bg-gray-50"
              >
                Today
              </button>
              
              <button 
                onClick={() => {
                  const nextDay = new Date(selectedDate);
                  nextDay.setDate(nextDay.getDate() + 1);
                  setSelectedDate(nextDay);
                }}
                className="px-3 py-1 text-sm rounded border hover:bg-gray-50"
              >
                Next Day
              </button>
            </div>
            
            <div className="mt-6">
              {selectedDateTodos.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateTodos.map(todo => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg border">
                  <p className="text-gray-500">No tasks scheduled for this day.</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md text-sm"
                    // This button would typically open your TodoForm component
                    onClick={() => {/* Open TodoForm */}}
                  >
                    Add Task for this Day
                  </button>
                </div>
              )}
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default CalendarView;
