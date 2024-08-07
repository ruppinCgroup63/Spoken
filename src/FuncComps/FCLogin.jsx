import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "./FCErrorMessage";

//const apiUrl = 'https://proj.ruppin.ac.il/cgroup63/test2/tar1/api/Users/Login';
const apiUrl = "https://localhost:44326/api/Users/Login";

function Login(props) {
  const navigate = useNavigate();

  const Users = props.userList;
  console.log(Users);

  const [user, setUsers] = useState({
    UserName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Phone: "",
    LangName: "",
    DomainName: "",
    Job: "",
    Employee: true,
    Signature: "",
  });

  //בדיקת שגיאות
  const [errors, setErrors] = useState({
    Email: "",
    Password: "",
  });

  const [emailExists, setEmailExists] = useState(false); // סטייט למעקב אם האימייל כבר קיים

  const handleValidation = (name, isValid, errorMessage) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: isValid ? "" : errorMessage,
    }));
  };

  //ולידציה למייל
  const validateEmail = (e) => {
    const text = e.target.value;
    const regexEmail = /^[^\s@]+@[^\s@]+\.(?:com)$/;
    const isValid = regexEmail.test(text);
    handleValidation(
      "Email",
      isValid,
      "follow the format abc@gmail.com abc@yahoo.com"
    );
    if (isValid) {
      setUsers((prevUser) => ({
        ...prevUser,
        Email: text,
      }));
    }
  };

  //ולידציה לסיסמא
  const validatePassword = (e) => {
    const text = e.target.value;
    const regexPassworde =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>\/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:'",.<>\/?]{7,12}$/;
    const isValid = regexPassworde.test(text);
    handleValidation(
      "Password",
      isValid,
      "Invalid password! Password must contain between 7 and 12 characters, at least one special character, one uppercase letter, and one number."
    );
    if (isValid) {
      setUsers((prevUser) => ({
        ...prevUser,
        Password: text,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);

    // Check if the entered email and password match the admin credentials
    if (user.Email === "Admin@gmail.com" && user.Password === "Admin@123") {
      navigate("/Admin");
      return;
    }

    // Fetch users from the API
    fetch(apiUrl, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
      }),
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) {
          // Check if response status is not OK
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((loggedInUser) => {
        if (loggedInUser.email != null) {
          console.log("Login successful!");
          // Store user data in session storage and navigate to home page
          sessionStorage.setItem("user", JSON.stringify(loggedInUser));
          clearFields();
          navigate("/HomePage");
        } else {
          console.log("Invalid email or password!"); // Notify user of invalid credentials
          setEmailExists(true);
        }
      })
      .catch((error) => {
        console.log("Login error:", error);
        setEmailExists(true); // עדכון הסטייט לאמת אם האימייל כבר קיים
      });
  };

  const clearFields = () => {
    setUsers({ Email: "", Password: "" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
      <div
        className="card w-96 bg-base-100 shadow-xl"
        style={{ backgroundColor: "#E4E9F2" }}
      >
        <div className="card-body text-center">
          {" "}
          {/* Center text */}
          <div className="flex items-center justify-center">
            <div className="w-15 h-13">
              <img
                src="/public/login/SpokenLogoNew.png"
                alt="Error"
                className="w-full h-full object-contain"
                style={{ width: "10rem", height: "4rem" }}
              />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {emailExists && (
              <ErrorMessage message="Invalid email or password!" />
            )}{" "}
            {/* תצוגת הודעת השגיאה */}
            <br></br>
            <div className="form-control">
              <label
                className={`input input-bordered flex items-center gap-2 relative ${
                  errors.Email ? "input-error" : ""
                }`}
                style={{ backgroundColor: "#E4E9F2", borderColor: "#070A40" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  className={`grow ${errors.Email ? "input-error" : ""}`}
                  placeholder="Email"
                  onBlur={validateEmail}
                  aria-describedby={errors.Email ? "Email-error" : ""}
                  value={user.Email}
                  onChange={(e) => setUsers({ ...user, Email: e.target.value })}
                  style={{ borderColor: errors.Email ? "#e53e3e" : "" }}
                />
              </label>
              {errors.Email && (
                <p id="Email-error" className="text-red-500 mt-2">
                  {errors.Email}
                </p>
              )}
            </div>
            <br></br>
            <div className="form-control">
              <label
                className={`input input-bordered flex items-center gap-2 relative ${
                  errors.Password ? "input-error" : ""
                }`}
                style={{ backgroundColor: "#E4E9F2", borderColor: "#070A40" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  className={`grow ${errors.Password ? "input-error" : ""}`}
                  placeholder="Password"
                  onBlur={validatePassword}
                  aria-describedby={errors.Password ? "Password-error" : ""}
                  value={user.Password}
                  onChange={(e) =>
                    setUsers({ ...user, Password: e.target.value })
                  }
                  style={{ borderColor: errors.Password ? "#e53e3e" : "" }}
                />
              </label>
              {errors.Password && (
                <p id="Password-error" className="text-red-500 mt-2">
                  {errors.Password}
                </p>
              )}
            </div>
            {/* Forgot password button */}
            <div className="form-control">
              <button
                onClick={() => (window.location.href = "/ForgotPassword")}
                style={{
                  color: "#2D4BA6",
                  fontSize: "0.68rem",
                  textDecoration: "none",
                  padding: "0.25rem 0.5rem",
                }}
                type="button"
                className="btn btn-link ml-auto text-sm"
              >
                forgot your password?
              </button>
            </div>
            <div style={{ marginLeft: "auto" }} className="form-control mt-6">
              <button
                onClick={() => navigate("/Register")}
                type="button"
                className="btn btn-link text-sm "
                style={{
                  backgroundColor: "transparent",
                  color: "#2D4BA6",
                  textDecoration: "none",
                }}
              >
                create account
              </button>
            </div>
            <div className="form-control mt-6">
              <button
                style={{ padding: "0.25rem 1rem", backgroundColor: "#070A40" }}
                type="submit"
                className="btn btn-xs sm:btn-sm  btn-primary"
              >
                Login
              </button>
            </div>
            <div className="mt-10 mt-4 flex items-center justify-center">
              <div className="w-96 h-58">
                <img
                  src="/public/login/LoginImage.png"
                  alt="Error"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
