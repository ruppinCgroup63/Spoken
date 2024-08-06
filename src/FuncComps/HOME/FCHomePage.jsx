import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./FCCard";
import "./HomePage.css";

const apiUrlRecent = "https://localhost:44326/api/RecentTemplates/getByUserEmail";
const apiUrlTemplates = "https://localhost:44326/api/Templates/getByUserEmail";
const apiUrlFavorites = "https://localhost:44326/api/UserFavorites/getByUserEmail";
const apiUrlBlocks = "https://localhost:44326/api/BlocksInTemplates/getBlocksByTemplateNo";
const apiUrlUpdateFavorite = "https://localhost:44326/api/UserFavorites";
const apiUrlDeleteFavorites = "https://localhost:44326/api/UserFavorites";
const apiUrlUpdateRecent = "https://localhost:44326/api/RecentTemplates";

function HomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [recentTemplates, setRecentTemplates] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTemplateBlocks, setSelectedTemplateBlocks] = useState([]);
  const [navOpen, setNavOpen] = useState(false); // State to manage the nav bar

  useEffect(() => {
    const userFromStorage = JSON.parse(sessionStorage.getItem("user"));
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

      fetchRecentTemplates(userFromStorage.email);
      fetchFavorites(userFromStorage.email);
    }
  }, []);

  const fetchRecentTemplates = async (email) => {
    try {
      const response = await fetch(apiUrlRecent, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const recentTemplateNos = await response.json();
      if (recentTemplateNos.length > 0) {
        fetchAllTemplates(email, recentTemplateNos);
      } else {
        setRecentTemplates([]);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching recent templates:", error);
    }
  };

  const fetchAllTemplates = async (email, recentTemplateNos) => {
    try {
      const response = await fetch(apiUrlTemplates, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const templates = await response.json();
      const filteredTemplates = templates.filter((template) =>
        recentTemplateNos.some(
          (recent) => recent.templateNo === template.templateNo
        )
      );

      setRecentTemplates(filteredTemplates);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching templates:", error);
    }
  };

  const fetchFavorites = async (email) => {
    try {
      const response = await fetch(apiUrlFavorites, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(email),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const favoritesData = await response.json();
      setFavorites(favoritesData);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching favorites:", error);
    }
  };

  const handleFavoriteToggle = async (templateNo) => {
    const template = recentTemplates.find(
      (template) => template.templateNo === templateNo
    );

    const updatedFavorites = { Email: user.Email, TemplateNo: templateNo };

    try {
      if (favorites.some((fav) => fav.templateNo === templateNo)) {
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
      } else {
        const response = await fetch(apiUrlUpdateFavorite, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFavorites),
        });

        if (!response.ok) {
          throw new Error("Failed to update favorite");
        }
      }

      setFavorites((prevFavorites) =>
        prevFavorites.some((fav) => fav.templateNo === templateNo)
          ? prevFavorites.filter((fav) => fav.templateNo !== templateNo)
          : [...prevFavorites, { templateNo }]
      );
    } catch (error) {
      setError(error.message);
      console.error("Failed to update favorite:", error);
    }
  };

  const handleTemplateClick = async (selectedTemplate) => {
    console.log(selectedTemplate.templateNo);
    try {
      const responseBlocks = await fetch(apiUrlBlocks, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedTemplate),
      });

      if (!responseBlocks.ok) {
        throw new Error("Failed to fetch data");
      }

      const blocksData = await responseBlocks.json();

      const recentTemplate = {
        Email: user.Email,
        TemplateNo: selectedTemplate.templateNo,
      };
      const responseUpdateRecent = await fetch(apiUrlUpdateRecent, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recentTemplate),
      });

      if (!responseUpdateRecent.ok) {
        const errorText = await responseUpdateRecent.text();
        throw new Error(errorText);
      }

      navigate("/TemplateToDictate", {
        state: { selectedTemplate, Data: blocksData, user },
      });
    } catch (error) {
      setError(error.message);
      console.error("Error handling template click:", error);
    }
  };

  const handleCreateSummaryClick = async (template) => {
    try {
      const responseBlocks = await fetch(apiUrlBlocks, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      });

      if (!responseBlocks.ok) {
        throw new Error("Failed to fetch blocks data");
      }

      const blocksData = await responseBlocks.json();
      setSelectedTemplateBlocks(blocksData);
      navigate("/CreateSummary", {
        state: { template, selectedTemplateBlocks: blocksData, user },
      });
    } catch (error) {
      setError("Failed to fetch blocks data. Please try again.");
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
            <h3
              className="text-sm self-start mb-2"
              style={{ color: "#070A40", cursor: "pointer" }}
            >
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
              onClick={() => {
                console.log("SVG clicked");
                setNavOpen(!navOpen);
              }} // Toggle nav bar
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
                navigate("/ChooseTemplate", { state: { user } });
              }}
            >
              All templates
            </span>
          </div>
          <main className="grid grid-cols-2 gap-2">
            {recentTemplates.map((template) => (
              <div
                key={template.templateNo}
                className="cursor-pointer"
                onClick={() => handleTemplateClick(template)}
              >
                <Card
                  title={template.templateName}
                  favorite={favorites.some(
                    (fav) => fav.templateNo === template.templateNo
                  )}
                  description={template.description}
                  tags={template.tags ? template.tags.split(",") : []}
                  onFavoriteToggle={() =>
                    handleFavoriteToggle(template.templateNo)
                  }
                  onCreateSummaryClick={() => handleCreateSummaryClick(template)}
                />
              </div>
            ))}
          </main>
        </div>
      </div>
      {navOpen && (
        <div className="side-nav">
          <ul>
            <li onClick={() => navigate("/AllSummery")}>All Summaries</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default HomePage;
