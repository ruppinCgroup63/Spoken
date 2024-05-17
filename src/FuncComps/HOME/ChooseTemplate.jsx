import React, { useState, useEffect } from "react";
import { ResizableBox } from 'react-resizable';
import "react-resizable/css/styles.css";

function ChooseTemplate() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateBlocks, setSelectedTemplateBlocks] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [error, setError] = useState(null);

  const apiUrlTemplate = "https://localhost:44326/api/Templates";
  const apiUrlBlocks = "https://localhost:44326/api/BlocksInTemplates/getBlocksByTemplateNo";

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
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching template data:", error);
        setError("Failed to fetch template data. Please try again.");
      });
  }, []);




  const handleTemplateClick = (selectedTemplate) => {
    setSelectedTemplate(selectedTemplate);
    console.log(selectedTemplate);
    console.log(templates);

    

    fetch(apiUrlBlocks, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedTemplate) 
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
     
    })
    .catch((error) => {
      console.error("Error fetching blocks data:", error);
      setError("Failed to fetch blocks data. Please try again.");
    });
  };


  function renderContent(block, index) {
    const updateItem = (idx, key, value) => {
      const newBlocks = [...selectedTemplateBlocks];
      newBlocks[idx] = { ...newBlocks[idx], [key]: value };
      setSelectedTemplateBlocks(newBlocks);
    };
  
    const removeItem = (idx) => {
      const newBlocks = [...selectedTemplateBlocks].filter((_, i) => i !== idx);
      setSelectedTemplateBlocks(newBlocks);
    };
  
    

    switch (block.type) {
      case "file":
        return (
          <input
            type="file"
            style={{
              width: "100%",
              marginBottom: "2px",
              border: "1px solid silver",
            }}
          />
        );
      case "signature":
        return (
          <img
            src={block.image}
            alt="Signature"
            style={{
              width: "100%",
              maxHeight: "100px",
              border: "1px solid silver",
              padding: "2px",
            }}
          />
        );
      default:
        return (
          <>
            <input
              type="text"
              placeholder="Enter title"
              value={block.title || ''}
              onChange={(e) => updateItem(index, 'title', e.target.value)}
              style={{
                width: "100%",
                marginBottom: "2px",
                border: "1px solid silver",
              }}
            />
            <textarea
              placeholder="Enter text"
              value={block.text || ''}
              onChange={(e) => updateItem(index, 'text', e.target.value)}
              style={{
                width: "100%",
                height: "45px",
                border: "1px solid silver",
              }}
            />
          </>
        );
    }
  }
  


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
            <h3><b>Template Name:</b> {template.templateName}</h3>
            <p> <b>Description:</b> {template.description}</p>
            <p><b>By:</b> {template.email}</p>
            <p><b>Is Public:</b> {template.isPublic ? "Yes" : "No"}</p>
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
              <strong>Creator Email:</strong> {selectedTemplate.email}
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
              {selectedTemplateBlocks.map((block, index) => (
                <ResizableBox
                  key={block.blockNo}
                  width={300}
                  height={100}
                  minConstraints={[100, 100]}
                  maxConstraints={[350, 100]}
                  resizeHandles={['e', 'w']}
                  className="resizable"
                  style={{ margin: 'auto', border: '1px solid silver', marginTop: '1rem' }}
                >
                  <div
                    style={{
                      padding: '5px',
                      overflow: 'hidden',
                      position: 'relative',
                      border: '1px solid silver',
                    }}
                  >
                    <img
                      src="/public/createTemplate/Trash1.png"
                      alt="Delete"
                      style={{
                        height: '65px',
                        width: '65px',
                        position: 'absolute',
                        top: '-14.5px',
                        right: '-10px',
                        cursor: 'pointer',
                        zIndex: 10,
                      }}
                      onClick={() => removeItem(index)}
                    />

                    {/* Function to render content based on the type */}
                    {renderContent(block, index)}
                  </div>
                </ResizableBox>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChooseTemplate;
