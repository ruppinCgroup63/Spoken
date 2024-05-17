import { useState } from "react";
import "./App.css";
import Login from "./FuncComps/FCLogin";
import RegistrationPage from "./FuncComps/Register/FCRegister";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegistrationPage2 from "./FuncComps/Register/FCRegister2";
import RegistrationPage3 from "./FuncComps/Register/FCRegister3";
import HomePage from "./FuncComps/HOME/FCHomePage";
import CreateTemplate from "./FuncComps/CreateTemplate/FCCreateTemplate";
import CreateTemplate2 from "./FuncComps/CreateTemplate/FCCreateTemplate2";
import CreateTemplate3 from "./FuncComps/CreateTemplate/FCCreateTemplate3";
import "./FuncComps/CreateTemplate/createTemplat3.css";
//import Main from "./FuncComps/SpeechRecognition/Main";
import "regenerator-runtime/runtime";
import ChooseTemplate from "./FuncComps/HOME/ChooseTemplate";

function App() {
  const [usersList, setUsersList] = useState([]);

  const getUserFromChild = (user) => {
    setUsersList((prevUsersList) => [...prevUsersList, user]);
  };
  //     <Route path="/Main" element={<Main />} />
  console.log(usersList);
  //console.log(userData);

  return (
    <div>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login userList={usersList} />} />
            <Route path="/Register" element={<RegistrationPage />} />
            <Route path="/Register2" element={<RegistrationPage2 />} />
            <Route path="/Register3" element={<RegistrationPage3 sendtoParent={getUserFromChild} />}  />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/CreateTemplate" element={<CreateTemplate />} />
            <Route path="/CreateTemplate2" element={<CreateTemplate2 />} />
            <Route path="/CreateTemplate3" element={<CreateTemplate3 />} />
            <Route path="/ChooseTemplate" element={<ChooseTemplate />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
