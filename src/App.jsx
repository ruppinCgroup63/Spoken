import { useState } from 'react'
import './App.css'
import Login from './FuncComps/FCLogin'
import RegistrationPage from './FuncComps/FCRegister'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegistrationPage2 from './FuncComps/FCRegister2'
import RegistrationPage3 from './FuncComps/FCRegister3'



function App() {

  const [usersList, setUsersList] = useState([]);

  const getUserFromChild = (user) => {
    setUsersList(prevUsersList => [...prevUsersList, user]);  //מקבלת את היוזר מהילד ומכניסה אותו לרשימה
  }
  console.log(usersList);

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login  userList={usersList}/>} />
        <Route path="/Register" element={<RegistrationPage userList={usersList} sendtoParent={getUserFromChild} />} />
        <Route path="/Register2" element={<RegistrationPage2 />} />
        <Route path="/Register3" element={<RegistrationPage3 />} />

      </Routes>
    </BrowserRouter>



  )
}

export default App
