import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "../CreateTemplate/style.css";

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
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
  );
}

export default ChooseTemplate;
