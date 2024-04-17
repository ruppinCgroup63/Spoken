import { useState } from 'react'
import './App.css'
import Login from './FuncComps/FCLogin'
import RegistrationPage from './FuncComps/FCRegister'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegistrationPage2 from './FuncComps/FCRegister2'
import RegistrationPage3 from './FuncComps/FCRegister3'
import HomePage from './FuncComps/HOME.jsx/FCHomePage';



function App() {

  const [usersList, setUsersList] = useState([]);

 


  const getUserFromChild = (user) => {
  
    setUsersList(prevUsersList => [...prevUsersList, user]); 
};

  console.log(usersList);
  //console.log(userData);


  return (
    <div>
      <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login  userList={usersList}/>} />
        <Route path="/Register" element={<RegistrationPage  />} />
        <Route path="/Register2" element={<RegistrationPage2  />} />
        <Route path="/Register3" element={<RegistrationPage3 sendtoParent={getUserFromChild}/>} />
        <Route path="/HomePage" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
      </div>
    </div>


  )
}

export default App
