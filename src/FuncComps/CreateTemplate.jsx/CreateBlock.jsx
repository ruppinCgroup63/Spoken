import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableBox = ({ children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'box',
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{
      opacity: isDragging ? 0.5 : 1,
      fontSize: 25,
      fontWeight: 'bold',
      cursor: 'move',
      border: '1px dashed gray',
      padding: '0.5rem 1rem',
      marginBottom: '1.5rem',
      backgroundColor: 'white',
    }}>
      {children}
    </div>
  );
};

export default DraggableBox;
