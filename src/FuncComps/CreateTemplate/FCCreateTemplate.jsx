import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CreateTemplate() {
  const navigate = useNavigate();
  const { state } = useLocation();//קבלת המידע שהועבר מהעמוד הקודם
  let templateObj = state;

  // פונקציה לשליפת פריט JSON מ-sessionStorage
  const getUserDataFromSessionStorage = () => {
    const userDataJson = sessionStorage.getItem("user");
    return userDataJson ? JSON.parse(userDataJson) : {};
  };

  // אתחול אובייקט ה-template
  const [template, setTemplate] = useState({
    TemplateNo: Math.random().toString(36).substring(2, 9),
    TemplateName: templateObj ? templateObj.template.TemplateName : "",
    Description: templateObj ? templateObj.template.Description : "",
    Email: "", 
    Signature: "",
    IsPublic: false,
  });

  // נעדכן את ה-template  ברגע שהקומפוננטה נטענת לראשונה
  useEffect(() => {
    // שליפת המידע מ-session storage
    const userData = getUserDataFromSessionStorage();
    console.log("User data:", userData);
    //העדכון מתבצע ע"י הערכים ששלפנו מהסיישן סטורג'
    // עדכון ערכים ב-template 
    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      Email: userData.email || "",
      Signature: userData.signature || "",
      IsPublic: false,
    }));
  }, []); // [] מוודא שה-useEffect ירוץ רק פעם אחת
  console.log(template);

  // פונקציה לעדכון שגיאות
  const [errors, setErrors] = useState({
    TemplateName: "",
    Description: "",
  });

  //ניהול הולידציות
  const handleValidation = (TemplateName, isValid, errorMessage) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [TemplateName]: isValid ? "" : errorMessage,
    }));
  };

  // ולידציה לשם של התבנית
  const validaterName = (e) => {
    const text = e.target.value;
    const regexUserName = /^[a-zA-Z\s]{1,60}$/;
    const isValid = regexUserName.test(text);
    handleValidation("TemplateName", isValid, "Invalid input! Only English letters");
    if (isValid) {
      setTemplate((prevUser) => ({
        ...prevUser,
        TemplateName: text,
      }));
    }
  };

  //ולידציה לתיאור
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
      setTemplate((prevUser) => ({//אם השם תקין מעדכנים את הסטייס
        ...prevUser,
        Description: text,
      }));
    }
  };

//חזרה לדף הבית
  const handleButtonClick = () => {
    navigate("/HomePage");
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // טיפול בשליחת הטופס
    let validations = Object.values(errors);
    let userFields = Object.values(template);
    if (validations.some((value) => value !== "")) {
      console.log("Entering an invalid value in one of the fields");
    } else if (userFields.some((value) => value === "")) {
      console.log("You need to fill in all the fields");
    } else {
      navigate("/CreateTemplate2", {
        state: { template, origin: "CreateTemplate" },
      });
    }
  };

  

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
        <div
          className="card w-full max-w-md bg-base-100 shadow-xl p-5"
          style={{ backgroundColor: "#E4E9F2" }}
        >
          <div className="card-body flex items-center justify-center">
            <br />
            <form onSubmit={handleSubmit}>
            <label
              className="btn btn-circle swap swap-rotate"
              style={{ position: "absolute", top: "30px", left: "20px" ,backgroundColor: "#E4E9F2", borderColor: "#E4E9F2"}}
              onClick={handleButtonClick} //חזרה למסך הבית
            >
              <input type="checkbox" />
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
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
            
              <div
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
                className="steps space-x-2 mb-4"
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
                  color: "#070A40",
                  fontWeight: "bold",
                }}
              >
                Template name?
              </h3>
              <div className="form-control">
                <label
                  className={`input input-bordered flex items-center gap-2 relative ${
                    errors.TemplateName ? "input-error" : ""
                  }`}
                >
                  <input
                    type="text"
                    className={`grow ${errors.TemplateName ? "input-error" : ""}`}
                    placeholder="new client..."
                    onBlur={validaterName}
                    aria-describedby={errors.TemplateName ? "name-error" : ""}
                    value={template.TemplateName}
                    onChange={(e) =>
                      setTemplate({ ...template, TemplateName: e.target.value })
                    }
                    style={{ borderColor: errors.TemplateName ? "#e53e3e" : "" }}
                  />
                </label>
                {errors.TemplateName && (
                  <p id="name-error" className="text-red-500 mt-2">
                    {errors.TemplateName}
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
                  color: "#070A40",
                  fontWeight: "bold",
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
                    className={`grow ${
                      errors.Description ? "input-error" : ""
                    }`}
                    placeholder="new client..."
                    onBlur={validaterDescription}
                    aria-describedby={errors.Description ? "name-error" : ""}
                    value={template.Description}
                    onChange={(e) =>
                      setTemplate({ ...template, Description: e.target.value })
                    }
                    style={{ borderColor: errors.Description ? "#e53e3e" : "" }}
                  />
                </label>
                {errors.Description && (
                  <p id="name-error" className="text-red-500 mt-2">
                    {errors.Description}
                  </p>
                )}
              </div>
              <div className="button-container">
                <div style={{ flexGrow: "1" }}></div>
                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary continue"
                  >
                    Continue
                  </button>
                </div>
              </div>
              <div className="mt-10 mt-4 flex items-center justify-center">
                <div className="w-40 h-40" style={{ marginTop: "2rem" }}>
                  <img
                    src={import.meta.env.BASE_URL +"/createTemplate/createTem.png"}
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
