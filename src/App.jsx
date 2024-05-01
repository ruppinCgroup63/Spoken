import { useState } from 'react'
import './App.css'
import Login from './FuncComps/FCLogin'
import RegistrationPage from './FuncComps/Register.jsx/FCRegister'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegistrationPage2 from './FuncComps/Register.jsx/FCRegister2'
import RegistrationPage3 from './FuncComps/Register.jsx/FCRegister3'
import HomePage from './FuncComps/HOME.jsx/FCHomePage';
import CreateTemplate from './FuncComps/CreateTemplate.jsx/FCCreateTemplate'
import CreateTemplate2 from './FuncComps/CreateTemplate.jsx/FCCreateTemplate2'
import CreateTemplate3 from './FuncComps/CreateTemplate.jsx/FCCreateTemplate3';



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
        <Route path="/CreateTemplate" element={<CreateTemplate/>} />
        <Route path="/CreateTemplate2" element={<CreateTemplate2/>} />
        <Route path="/CreateTemplate3" element={<CreateTemplate3/>} />
      </Routes>
    </BrowserRouter>
      </div>
    </div>


  )
}

export default App
