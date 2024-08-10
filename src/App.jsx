import "regenerator-runtime/runtime";
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
import ChooseTemplate from "./FuncComps/HOME/ChooseTemplate";
import TemplateToDictate from "./FuncComps/CreateTemplate/TemplatePreview";
import FavoriteTemplates from "./FuncComps/HOME/FavoriteTemplates";
import CreateSummary from "./FuncComps/CreateSummary/CreateSummary";
import TemplateCreatedSuccessfully from "./FuncComps/CreateTemplate/TemplateCreatedSuccessfully";
import Admins from "./FuncComps/Admin/Admins";
import EditUser from "./FuncComps/Admin/EditUsers";
import AllSummery from "./FuncComps/HOME/AllSummery";
import SummaryPreview from "./FuncComps/HOME/SummaryPreview";
import SummarySuccess from "./FuncComps/CreateSummary/SummarySuccess";
import ForgotPassword from "./FuncComps/ForgotPassword";

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
            <Route
              path="/Register3"
              element={<RegistrationPage3 sendtoParent={getUserFromChild} />}
            />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/CreateTemplate" element={<CreateTemplate />} />
            <Route path="/CreateTemplate2" element={<CreateTemplate2 />} />
            <Route path="/CreateTemplate3" element={<CreateTemplate3 />} />
            <Route path="/ChooseTemplate" element={<ChooseTemplate />} />
            <Route path="/TemplatePreview" element={<TemplateToDictate />} />
            <Route path="/FavoriteTemplates" element={<FavoriteTemplates />} />
            <Route path="/CreateSummary" element={<CreateSummary />} />
            <Route
              path="/TemplateCreatedSuccessfully"
              element={<TemplateCreatedSuccessfully />}
            />
            <Route path="/Admin" element={<Admins />} />
            <Route path="/EditUsers" element={<EditUser />} />
            <Route path="/AllSummery" element={<AllSummery />} />
            <Route path="/SummaryPreview" element={<SummaryPreview />} />
            <Route path="/SummarySuccess" element={<SummarySuccess />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
