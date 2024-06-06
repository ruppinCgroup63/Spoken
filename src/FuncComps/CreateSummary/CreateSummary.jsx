import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../CreateTemplate/style.css";
import Card from "./FCCard";

const apiUrlTemplate = "https://localhost:44326/api/Templates/getByUserEmail";
const apiUrlBlocks ="https://localhost:44326/api/BlocksInTemplates/getBlocksByTemplateNo";
const apiUrlUpdateFavorite = "https://localhost:44326/api/UserFavorites";
const apiUrlFavorites = "https://localhost:44326/api/UserFavorites/getByUserEmail";
const apiUrlDeleteFavorites= "https://localhost:44326/api/UserFavorites";

function CreatSummary() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state.user;

  const [templates, setTemplates] = useState([]);
  const [ setSelectedTemplateBlocks] = useState([]);
  const [setSelectedTemplate] = useState(null);
  const [ setError] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const fetchTemplatesAndFavorites = async () => {
      try {
        console.log("Fetching templates for email:", user.Email);

        const responseTemplates = await fetch(apiUrlTemplate, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(user.Email),
        });

        if (!responseTemplates.ok) {
          const errorText = await responseTemplates.text();
          console.error("Error response from templates API:", errorText);
          throw new Error("Failed to fetch templates");
        }

        const templatesData = await responseTemplates.json();
        console.log("Templates data:", templatesData);

        console.log("Fetching favorites for email:", user.Email);
        const responseFavorites = await fetch(apiUrlFavorites, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(user.Email),
        });

        if (!responseFavorites.ok) {
          const errorText = await responseFavorites.text();
          console.error("Error response from favorites API:", errorText);
          throw new Error("Failed to fetch favorites");
        }

        const favoritesData = await responseFavorites.json();
        console.log("Favorites data:", favoritesData);

        const templatesWithFavorites = templatesData.map(template => ({
          ...template,
          isFavorite: favoritesData.some(fav => fav.templateNo === template.templateNo)
        }));

        console.log("Templates with favorites:", templatesWithFavorites);
        setTemplates(templatesWithFavorites);
      } catch (error) {
        console.error("Error fetching templates or favorites:", error);
        setError("Failed to fetch templates or favorites. Please try again.");
      }
    };

    fetchTemplatesAndFavorites();
  }, [user.Email]);

  const handleTemplateClick = (selectedTemplate) => {
    setSelectedTemplate(selectedTemplate);

    const handleAddClick = (selectedTemplate) => {
        setSelectedTemplate(selectedTemplate);
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
              navigate("/TemplateToDictate", {
                state: { selectedTemplate, Data: data, user },
              });
            })
            .catch((error) => {
              console.error("Error fetching blocks data:", error);
              setError("Failed to fetch blocks data. Please try again.");
            });
        };
        
    

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
              <b>{user.UserName}</b>
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

          <h1 style={{ margin: '0 auto' }}><b>Templates</b></h1>

          <div className="flex items-center" style={{ marginBottom: "4rem", margin: "0 auto", marginTop: "2rem" }}>
            <button
              className={`btn ${showFavorites ? "btn-active" : ""} btn-sm`}
              onClick={() =>{ setShowFavorites(true);
                navigate("/FavoriteTemplates", { state: { templates , user} });
              }}
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
              onClick={() => setShowFavorites(false)}
              style={{
                backgroundColor: !showFavorites ? "#070A40" : "#E1E1E1",
                borderColor: !showFavorites ? "#070A40" : "#E1E1E1",
                color: !showFavorites ? "white" : "#070A40",
              }}
            >
              All templates
            </button>
          </div>

          <main className="grid grid-cols-2 gap-2" style={{ marginTop: '2rem' }}>
            {templates.map((template) => (
              <div
                key={template.templateNo}
                onClick={() => handleAddClick(template)}
                className="cursor-pointer"
              >
                <Card
                  title={template.templateName}
                  favorite={template.isFavorite}
                  description={template.description}
                  tags={template.tags || []}
                  onFavoriteToggle={() => handleFavoriteToggle(template.templateNo)}
                  onCardClick={() => handleTemplateClick(template)} // הוספת אירוע הלחיצה על 
                  onAddClick={() => handleAddClick(template)} //יצירת סיכום מתוך תבנית 
                />
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}

export default CreatSummary;
