import React, { useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const ItemType = 'DRAGGABLE_ITEM';

const DraggableItem = ({ item, index, moveItem, width, setWidth }) => {
  const [, drag] = useDrag(() => ({
    type: ItemType,
    item: { id: item.id, index },
  }), [index, item.id]);

  const [, drop] = useDrop(() => ({
    accept: ItemType,
    hover(item, monitor) {
      if (item.index !== index) {
        moveItem(item.index, index);
        item.index = index;
      }
    },
  }), [index]);

  const handleResize = (event, { size }) => {
    setWidth(size.width);
  };

  return (
    <ResizableBox width={width} height={50} minConstraints={[100, 50]} maxConstraints={[Infinity, 50]} resizeHandles={['e', 'w']} onResize={handleResize} className="resizable">
      <div ref={(node) => drag(drop(node))} style={{ padding: '5px', overflow: 'hidden' }}>
        {item.type === 'input' ? (
          <input type="text" defaultValue={item.text} style={{ width: '100%' }} />
        ) : (
          <textarea defaultValue={item.text} style={{ width: '100%', height: '90%' }} />
        )}
      </div>
    </ResizableBox>
  );
};

const Container = () => {
  const [items, setItems] = useState([]);
  const [width, setWidth] = useState(300);  // Initial width for all text boxes

  const addItem = useCallback((type) => {
    const id = Math.random().toString(36).substring(2, 9);
    setItems(items => [...items, { id, type, text: type === 'input' ? 'כותרת' : 'פסקה' }]);
  }, []);

  const moveItem = useCallback((dragIndex, hoverIndex) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      const dragItem = updatedItems[dragIndex];
      updatedItems.splice(dragIndex, 1);
      updatedItems.splice(hoverIndex, 0, dragItem);
      return updatedItems;
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <button onClick={() => addItem('input')}>הוסף כותרת</button>
        <button onClick={() => addItem('textarea')}>הוסף פיסקה</button>
      </div>
      <div style={{ margin: '10px', padding: '10px', minHeight: '500px', border: '2px solid black', position: 'relative' }}>
        {items.map((item, index) => (
          <DraggableItem key={item.id} item={item} index={index} moveItem={moveItem} width={width} setWidth={setWidth} />
        ))}
      </div>
    </DndProvider>
  );
};

export default Container;
