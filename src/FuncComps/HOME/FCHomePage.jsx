import Card from "./FCCard";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState();
  useEffect(() => {
    const userFromStorage = JSON.parse(sessionStorage.getItem("user"));
    console.log(userFromStorage);
    if (userFromStorage) {
      setUserName(userFromStorage.userName);
      setUser({
        UserName: userFromStorage.userName,
        Email: userFromStorage.email,
        Password: userFromStorage.password,
        ConfirmPassword: userFromStorage.confirmPassword,
        Phone: userFromStorage.phone,
        LangName: userFromStorage.langName,
        DomainName: userFromStorage.domainName,
        Job: userFromStorage.job,
        Employee: userFromStorage.employee,
        Signature: userFromStorage.signature,
      });
    }
  }, []);

  return (
    <div className="bg-light-blue-500 min-h-screen flex justify-center items-center">
      <div
        className="card w-full max-w-md bg-base-100 shadow-xl p-5"
        style={{ backgroundColor: "#E4E9F2" }}
      >
        <div className="card-body flex flex-col items-start justify-center">
          <header className="flex justify-between items-start w-full align-self-start mb-4">
            <h3
              className="text-sm self-start mb-2"
              style={{ color: "#070A40", cursor: "pointer" }}
            >
              {" "}
              <b>{userName}</b>
            </h3>
            <label
              className="btn btn-circle swap swap-rotate self-start"
              style={{
                backgroundColor: "#E4E9F2",
                alignSelf: "start",
                borderColor: "#E4E9F2",
                marginTop: "-18px",
              }}
            >
              <input type="checkbox" />
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>
              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            </label>
          </header>

          <div
            style={{ display: "flex", alignItems: "center", marginTop: "3rem" }}
          >
            <img
              src="/public/homePage/addTemplate.png"
              alt="Error"
              onClick={() => {
                navigate("/CreateTemplate");
              }}
              style={{ marginRight: "0.5rem", cursor: "pointer" }}
            />
            <span
              style={{ color: "#070A40", cursor: "pointer" }}
              onClick={() => {
                navigate("/CreateTemplate");
              }}
            >
              New Template
            </span>
          </div>
          <div
            className="flex justify-between items-center w-full mb-4"
            style={{ marginTop: "2rem" }}
          >
            <h2 style={{ color: "#070A40", fontSize: "18px" }}>
              <b>Recent</b>
            </h2>

            <span
              style={{ color: "#2D4BA6", cursor: "pointer", fontSize: "12px" }}
              className="mr-2"
              onClick={() => {
                navigate("/ChooseTemplate" , {state:{user}});
              }}
            >
              All templates
            </span>
          </div>
          <main className="grid grid-cols-2 gap-2">
            <div>
              <Card title="Invoice" favorite={true} />
            </div>
            <div>
              <Card title="Invoice" favorite={true} />
            </div>
            <div>
              <Card title="Invoice" favorite={true} />
            </div>
            <div>
              <Card title="Invoice" favorite={true} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
