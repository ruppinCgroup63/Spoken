import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "./FCCard";
import CreateSummary from "../CreateSummary/CreateSummary";

const apiUrlDeleteFavorites = "https://localhost:44326/api/UserFavorites";
const apiUrlBlocks =
  "https://localhost:44326/api/BlocksInTemplates/getBlocksByTemplateNo";
/*const apiUrlDeleteFavorites = "https://localhost:7224/api/UserFavorites";
const apiUrlBlocks =
  "https://localhost:7224/api/BlocksInTemplates/getBlocksByTemplateNo";*/

export default function FavoriteTemplates() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { templates, user } = state;

  const [updatedTemplates, setUpdatedTemplates] = useState(templates);
  const [showFavorites, setShowFavorites] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplateBlocks, setSelectedTemplateBlocks] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  //חזרה לדף הבית
  const handleButtonClick = () => {
    navigate("/FavoriteTemplate", {
    });
  };


  const handleTemplateClick = (templateClicked) => {
    setSelectedTemplate(templateClicked);

  
    console.log(
      "-------------------setSelectedTemplate : ",
      selectedTemplate,
      "Temaplte clicked :",
      templateClicked
    );
    //פונקציה למשיכת כל הבלוקים השייכים לתבנית מסויימת , פרמטר: מספר התבנית
    fetch(apiUrlBlocks, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(templateClicked),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setSelectedTemplateBlocks(data);
        navigate("/TemplatePreview", {
          state: { selectedTemplate: templateClicked, data, user },
        });
      })
      .catch((error) => {
        console.error("Error fetching blocks data:", error);
        setError("Failed to fetch blocks data. Please try again.");
      });

    const recentTemplate = {
      Email: user.Email,
      TemplateNo: templateClicked.templateNo,
    };

    fetch(apiUrlUpdateRecent, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recentTemplate),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Recent template updated:", data);
      })
      .catch((error) => {
        console.error("Error updating recent template:", error);
        setError("Failed to update recent template. Please try again.");
      });
  };



  const handleFavoriteToggle = async (templateNo) => {
    const updatedFavorites = { Email: user.Email, TemplateNo: templateNo };
    console.log("Sending delete request to server:", updatedFavorites);

    try {
      const response = await fetch(apiUrlDeleteFavorites, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFavorites),
      });

      if (!response.ok) {
        throw new Error("Failed to remove favorite");
      }

      // Update local favorites list after successful deletion
      setUpdatedTemplates((prevTemplates) =>
        prevTemplates
          .map((template) =>
            template.templateNo === templateNo
              ? { ...template, isFavorite: false }
              : template
          )
          .filter((template) => template.isFavorite)
      );
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const CreateSummaryClick = async (template) => {
    console.log("Template clicked:", template);
    try {
      const response = await fetch(apiUrlBlocks, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blocks");
      }

      const blocksData = await response.json();
      console.log("Fetched blocks data:", blocksData);
      setSelectedTemplateBlocks(blocksData); // Set the blocks data here
      navigate("/CreateSummary", {
        state: { template: template, selectedTemplateBlocks: blocksData, user },
      });
    } catch (error) {
      console.error("Error fetching blocks data:", error);
    }
  };
  return (
    <div className="bg-light-blue-500 min-h-screen flex justify-center items-center">
      <div
        className="card w-full max-w-md bg-base-100 shadow-xl p-5"
        style={{ backgroundColor: "#E4E9F2" }}
      >
        <div className="card-body flex flex-col items-start justify-center">
          <header className="flex justify-between items-start w-full align-self-start mb-4">
            <label
              className="btn btn-circle swap swap-rotate"
              style={{
                position: "absolute",
                top: "30px",
                left: "20px",
                backgroundColor: "#E4E9F2",
                borderColor: "#E4E9F2",
              }}
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
            <div style={{ marginTop: "5px" }}>
              <h3
                className="text-sm"
                style={{ color: "#070A40", cursor: "pointer" }}
              ></h3>
            </div>
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
          <h1 style={{ margin: "0 auto" }}>
            <b>Favorite Templates</b>
          </h1>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}
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
            className="flex items-center"
            style={{
              marginBottom: "4rem",
              margin: "0 auto",
              marginTop: "2rem",
            }}
          >
            <button
              className={`btn ${showFavorites ? "btn-active" : ""} btn-sm`}
              onClick={() => setShowFavorites(true)}
              style={{
                backgroundColor: showFavorites ? "#070A40" : "#E1E1E1",
                borderColor: showFavorites ? "#070A40" : "#E1E1E1",
                color: showFavorites ? "white" : "#070A40",
              }}
            >
              Favorites
            </button>
            <button
              className={`btn ${!showFavorites ? "btn-active" : ""} btn-sm`}
              onClick={() => {
                setShowFavorites(false);
                navigate("/ChooseTemplate", { state: { user } });
              }}
              style={{
                backgroundColor: !showFavorites ? "#070A40" : "#E1E1E1",
                borderColor: !showFavorites ? "#070A40" : "#E1E1E1",
                color: !showFavorites ? "white" : "#070A40",
              }}
            >
              All templates
            </button>
          </div>
          <main
            className="grid grid-cols-2 gap-2"
            style={{ marginTop: "2rem" }}
          >
            {updatedTemplates
              .filter((template) => template.isFavorite)
              .map((template) => (
                <div
                  key={template.templateNo}
                  className="cursor-pointer"
                  
                >
                  <Card
                    title={template.templateName}
                    favorite={template.isFavorite}
                    description={template.description}
                    tags={template.tags || []}
                    onFavoriteToggle={() =>
                      handleFavoriteToggle(template.templateNo)}
                    onCardClick={() => handleTemplateClick(template)}
                    onCreateSummaryClick={() => CreateSummaryClick(template)}
                  />
                </div>
              ))}
          </main>
        </div>
      </div>
    </div>
  );
}
