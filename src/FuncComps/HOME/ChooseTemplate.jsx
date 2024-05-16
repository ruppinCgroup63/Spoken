import React, { useState, useEffect } from "react";

function ChooseTemplate() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateBlocks, setSelectedTemplateBlocks] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [error, setError] = useState(null);

  const apiUrlTemplate = "https://localhost:44326/api/Templates";
  const apiUrlBlocks = "https://localhost:44326/api/BlocksInTemplates";

  useEffect(() => {
    fetch(apiUrlTemplate)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setTemplates(data);
      })
      .catch((error) => {
        console.error("Error fetching template data:", error);
        setError("Failed to fetch template data. Please try again.");
      });
  }, []);

  const handleTemplateClick = (selectedTemplate) => {
    setSelectedTemplate(selectedTemplate);

    fetch(
      `${apiUrlBlocks}/getBlocksByTemplateNo/${selectedTemplate.templateNo}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setSelectedTemplateBlocks(data);
      })
      .catch((error) => {
        console.error("Error fetching blocks data:", error);
        setError("Failed to fetch blocks data. Please try again.");
      });
  };

  return (
    <div>
      <h1>Templates</h1>

      {error && <p>Error: {error}</p>}

      <ul>
        {templates.map((template) => (
          <li
            key={template.templateNo}
            onClick={() => handleTemplateClick(template)}
            style={{
              border: "1px solid black",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            <h3>{template.templateName}</h3>
            <p>{template.description}</p>
            <p>By: {template.creatorEmail}</p>
            <p>Is Public: {template.isPublic ? "Yes" : "No"}</p>
          </li>
        ))}
      </ul>

      {selectedTemplate && (
        <div className="mt-4">
          <h2 className="text-xl">Selected Template Details</h2>
          <div className="card bg-white shadow-xl p-3">
            <p>
              <strong>Template Name:</strong> {selectedTemplate.templateName}
            </p>
            <p>
              <strong>Description:</strong> {selectedTemplate.description}
            </p>
            <p>
              <strong>Creation Date:</strong>{" "}
              {new Date(selectedTemplate.createionDate).toLocaleDateString()}
            </p>
            <p>
              <strong>PreTemplate:</strong> {selectedTemplate.preTemplate}
            </p>
            <p>
              <strong>Creator Email:</strong> {selectedTemplate.creatorEmail}
            </p>
            <p>
              <strong>Domain Name:</strong> {selectedTemplate.domainName}
            </p>
            <p>
              <strong>Language:</strong> {selectedTemplate.langName}
            </p>
            <p>
              <strong>Is Public:</strong>{" "}
              {selectedTemplate.isPublic ? "Yes" : "No"}
            </p>

            <h2 className="text-xl mt-4">Blocks</h2>
            <div className="grid grid-cols-1 gap-4">
              {selectedTemplateBlocks.map((block) => (
                <div
                  key={block.blockNo}
                  className="card bg-white shadow-xl p-3"
                >
                  <p>
                    <strong>Type:</strong> {block.type}
                  </p>
                  <p>
                    <strong>Title:</strong> {block.title}
                  </p>
                  <p>
                    <strong>Text:</strong> {block.text}
                  </p>
                  <p>
                    <strong>KeyWord:</strong> {block.keyWord}
                  </p>
                  <p>
                    <strong>Is Active:</strong> {block.isActive ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Is Mandatory:</strong>{" "}
                    {block.isMandatory ? "Yes" : "No"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChooseTemplate;
