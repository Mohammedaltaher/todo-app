// src/components/advanced/DragDropContainer.jsx
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TodoItem from '../TodoItem';
import useDragDrop from '../../hooks/useDragDrop';

const DragDropContainer = ({ todos, listId = 'todo-list' }) => {
  const { onDragEnd } = useDragDrop();
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={listId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 rounded ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                  >
                    <TodoItem todo={todo} isDraggable={true} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragDropContainer;
