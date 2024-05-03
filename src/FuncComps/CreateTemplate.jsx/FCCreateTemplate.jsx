import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CreateTemplate() {
  const navigate = useNavigate();
  const { state } = useLocation();
  let templateObj = state;

  const [template, setTemplate] = useState({
    name: templateObj ? templateObj.template.name : "",
    Description: templateObj ? templateObj.template.Description : "",
  });

  //בדיקת שגיאות
  const [errors, setErrors] = useState({
    name: "",
    Description: "",
  });

  const handleValidation = (name, isValid, errorMessage) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: isValid ? "" : errorMessage,
    }));
  };

  //ולידציה לשם משתמש
  const validaterName = (e) => {
    const text = e.target.value;
    const regexUserName = /^[a-zA-Z\s]{1,60}$/;
    const isValid = regexUserName.test(text);
    handleValidation("name", isValid, "Invalid input! Only English letters");
    if (isValid) {
      setTemplate((prevUser) => ({
        ...prevUser,
        name: text,
      }));
    }
  };

  const validaterDescription = (e) => {
    const text = e.target.value;
    const regexUserName = /^[a-zA-Z\s]{1,60}$/;
    const isValid = regexUserName.test(text);
    handleValidation(
      "Description",
      isValid,
      "Invalid input! Only English letters"
    );
    if (isValid) {
      setTemplate((prevUser) => ({
        ...prevUser,
        Description: text,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission

    let validations = Object.values(errors);
    let userFields = Object.values(template);
    if (validations.some((value) => value !== "")) {
      console.log("Entering an invalid value in one of the fields");
    } else if (userFields.some((value) => value === "")) {
      console.log("You need to fill in all the fields ");
    } else {
      navigate("/CreateTemplate2", { state: { template } });

      // clearAllFileds();
    }
  };

  return (
    <>
      <div className="flex items-center justify-center bg-light-blue-500 py-10">
        <div className="card max-w-xs mx-auto bg-base-100 shadow-xl p-5">
          <div className="card-body flex items-center justify-center">
            <br />
            <form onSubmit={handleSubmit}>
              <label
                className="btn btn-circle swap swap-rotate"
                style={{ position: "absolute", top: "30px", left: "20px" }}
              >
                {/* this hidden checkbox controls the state */}
                <input type="checkbox" />

                {/* close icon */}
                <svg
                  className="swap-off fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </label>
              <div
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
                className="steps"
              >
                <div
                  style={{ marginRight: "1rem" }}
                  className="step step-primary"
                >
                  Name
                </div>
                <div style={{ marginRight: "1rem" }} className="step ">
                  Structure
                </div>
                <div style={{ marginRight: "1rem" }} className="step ">
                  Key<br></br>Words
                </div>
              </div>
              <br />
              <br />
              <h3
                className="card-title text-dark-blue-500"
                style={{
                  display: "block",
                  margin: "0 auto",
                  marginBottom: "0.5rem",
                }}
              >
                Template name?
              </h3>
              <div className="form-control">
                <label
                  className={`input input-bordered flex items-center gap-2 relative ${
                    errors.name ? "input-error" : ""
                  }`}
                >
                  <input
                    type="text"
                    className={`grow ${errors.name ? "input-error" : ""}`}
                    placeholder="new client..."
                    onBlur={validaterName}
                    aria-describedby={errors.name ? "name-error" : ""}
                    value={template.name}
                    onChange={(e) =>
                      setTemplate({ ...template, name: e.target.value })
                    }
                    style={{ borderColor: errors.name ? "#e53e3e" : "" }}
                  />
                </label>
                {errors.name && (
                  <p id="name-error" className="text-red-500 mt-2">
                    {errors.name}
                  </p>
                )}
              </div>
              <br />
              <h3
                className="card-title text-dark-blue-500"
                style={{
                  display: "block",
                  margin: "0 auto",
                  marginBottom: "0.5rem",
                }}
              >
                Description
              </h3>
              <div className="form-control">
                <label
                  className={`input input-bordered flex items-center gap-2 relative ${
                    errors.Description ? "input-error" : ""
                  }`}
                >
                  <input
                    type="text"
                    className={`grow ${errors.Description ? "input-error" : ""}`}
                    placeholder="new client..."
                    onBlur={validaterDescription}
                    aria-describedby={errors.Description ? "Description-error" : ""}
                    value={template.Description}
                    onChange={(e) =>
                      setTemplate({ ...template, Description: e.target.value })
                    }
                    style={{ borderColor: errors.Description ? "#e53e3e" : "" }}
                  />
                </label>
                {errors.Description && (
                  <p id="Description-error" className="text-red-500 mt-2">
                    {errors.Description}
                  </p>
                )}
              </div>

              <div className="button-container">
                <div style={{ flexGrow: "1" }}></div>
                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className="btn btn-md btn-primary  btn-primary"
                  >
                    Continue
                  </button>
                </div>
              </div>
              <div className="mt-10 mt-4 flex items-center justify-center">
                <div className="w-40 h-40" style={{ marginTop: "2rem" }}>
                  <img
                    src="/public/createTemplate/createTem.png"
                    alt="Error"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateTemplate;
