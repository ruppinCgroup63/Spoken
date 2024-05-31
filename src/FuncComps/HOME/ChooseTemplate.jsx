import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "../CreateTemplate/style.css";
import Card from "./FCCard";

//const apiUrlTemplate = 'https://proj.ruppin.ac.il/cgroup63/test2/tar1/api/Templates/getByUserEmail';
const apiUrlTemplate = "https://localhost:44326/api/Templates/getByUserEmail";
//const apiUrlBlocks = 'https://proj.ruppin.ac.il/cgroup63/test2/tar1/api/BlocksInTemplates/getBlocksByTemplateNo';
const apiUrlBlocks =
  "https://localhost:44326/api/BlocksInTemplates/getBlocksByTemplateNo";

function ChooseTemplate() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state.user;
  console.log(user.Email);
  console.log(JSON.stringify(user));

  const [templates, setTemplates] = useState([]);
  const [selectedTemplateBlocks, setSelectedTemplateBlocks] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [error, setError] = useState(null);
  //const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);


  useEffect(() => {
    fetch(apiUrlTemplate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(user.Email),
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setTemplates(data);
        console.log("Received templates:", data);
        console.log("Templates array : ", templates);
      })
      .catch((error) => {
        console.error("Error fetching blocks data:", error);
        setError("Failed to fetch blocks data. Please try again.");
      });
  }, []);

  const handleTemplateClick = (selectedTemplate) => {
    setSelectedTemplate(selectedTemplate);

    // Fetch blocks linked to the selected template
    fetch(apiUrlBlocks, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedTemplate),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setSelectedTemplateBlocks(data);
        console.log(data);
        // Navigate to TemplateToDictate component with selected template and blocks as props
        navigate("/TemplateToDictate", {
          state: { selectedTemplate, Data: data, user },
        });
      })
      .catch((error) => {
        console.error("Error fetching blocks data:", error);
        setError("Failed to fetch blocks data. Please try again.");
      });
  };

  return (
    <>
    {/*
      <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
        <div
          className="card w-full max-w-md bg-base-100 shadow-xl p-5"
          style={{ backgroundColor: "rgb(228, 233, 242)" }}
        >
          <div
            className="card body"
            style={{
              display: "flex 1 1 auto",
              flexDirection: "column",
              padding: "var(--padding-card,2rem)",
              gap: "rem",
            }}
          >
            <h1
              className="card-title text-dark-blue-500"
              style={{
                display: "block",
                margin: "0px auto 0.5rem",
                fontWeight: "bold",
              }}
            >
              Templates
            </h1>

            {error && <p>Error: {error}</p>}

            <ul>
              {templates.map((template) => (
                <li
                  key={template.templateNo}
                  onClick={() => handleTemplateClick(template)}
                  onMouseEnter={() => setHoveredIndex(template.index)} // Set hovered index on mouse enter
                  onMouseLeave={() => setHoveredIndex(null)} // Reset hovered index on mouse leave
                  style={{
                    border: "1px solid black",
                    borderRadius: "0.6rem",
                    margin: "10px",
                    cursor: "pointer",
                    transition:
                      "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
                    transform:
                      hoveredIndex === template.index
                        ? "scale(1.05)"
                        : "scale(1)",
                    backgroundColor:
                      hoveredIndex === template.index ? "#e4e9f2" : "white",
                    boxShadow:
                      hoveredIndex === template.index
                        ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                        : "none",
                  }}
                >
                  <h3
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      margin: "0px auto 0.5rem",
                      color: "rgb:(7,10,64)",
                    }}
                  >
                    Template Name: {template.templateName}
                  </h3>
                  <p>
                    {" "}
                    <b>Description:</b> {template.description}
                  </p>
                  <p>
                    <b>By:</b> {template.email}
                  </p>
                  <p>
                    <b>Is Public:</b> {template.isPublic ? "Yes" : "No"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
            */}

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
                <b> {user.UserName}</b>
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
            
              <h1 style={{margin:'0 auto'}}><b>Templates</b></h1>
           
            <div className="flex items-center" style={{ marginBottom: "4rem", margin: "0 auto" ,marginTop: "2rem"}}>
              <button
                className={`btn ${showFavorites ? "btn-active" : ""} btn-sm`}
                onClick={() => setShowFavorites(true)}
                style={{
                  backgroundColor: showFavorites ? "#070A40" : "#E1E1E1",
                  borderColor:showFavorites ? "#070A40" : "#E1E1E1",
                  color: showFavorites ? "white" : "#070A40",
                }}
              >
                Favorites
               </button>
              <button
                className={`btn ${!showFavorites ? "btn-active" : ""} btn-sm`}
                onClick={() => setShowFavorites(false)}
                style={{
                  backgroundColor: !showFavorites ? "#070A40" : "#E1E1E1",
                  borderColor:!showFavorites ? "#070A40" : "#E1E1E1",
                  color: !showFavorites ? "white" : "#070A40",
                }}
              >
                All templates
              </button>
            </div>

            <main className="grid grid-cols-2 gap-2" style={{marginTop:'2rem'}}>
            {templates.map((template) => (
              <div
                key={template.templateNo}
                onClick={() => handleTemplateClick(template)}
                className="cursor-pointer"
              >
                <Card
                  title={template.templateName}
                  favorite={false}
                  description={template.description} // Assuming your template object has a description field
                  tags={template.tags || []} // Assuming your template object has a tags field which is an array
                />
              </div>
            ))}
          </main>
          </div>
        </div>
      </div>
    </>

  );
}

export default ChooseTemplate;
