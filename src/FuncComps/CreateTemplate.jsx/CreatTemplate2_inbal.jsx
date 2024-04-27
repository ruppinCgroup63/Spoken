import { useState } from 'react';
import './App.css';
import Login from './FuncComps/FCLogin';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableBox from './DraggableBox'; // Import the draggable component

function App() {
  const [usersList, setUsersList] = useState([]);

  const getUserFromChild = (user) => {
    setUsersList(prevUsersList => [...prevUsersList, user]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login userList={usersList} />} />
          <Route path="/home" element={<DraggableBox>Drag me around</DraggableBox>} />
          {/* Add other routes here */}
        </Routes>
      </BrowserRouter>
    </DndProvider>
  );
}

export default App;
