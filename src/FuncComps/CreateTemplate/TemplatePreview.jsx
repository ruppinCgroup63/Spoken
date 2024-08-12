import "regenerator-runtime/runtime"; // גורם לתמיכה של פונקציות אסינכרוניות ובגינרטורס
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function TemplateToDictate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTemplate, selectedTemplateBlocks } = location.state || {}; //data is the items array
  const [items, setItems] = useState(selectedTemplateBlocks || []);

  //לשנות את גודל תיבת הטקסט של התמלול
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { target } = entry;
        target.style.height = "auto";
        target.style.height = `${target.scrollHeight}px`;
      }
    });

    const textAreas = document.querySelectorAll("textarea");
    textAreas.forEach((textarea) => {
      textarea.style.height = "auto";
      resizeObserver.observe(textarea);
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  //UseEffect עבור בדיקה האם הועברה תבנית ובלוקים של התבנית
  useEffect(() => {
    if (!selectedTemplate || !selectedTemplateBlocks) {
      console.error("No template data found!");
      return;
    }
  }, [selectedTemplate, selectedTemplateBlocks]);

  console.log(items);
  console.log(selectedTemplate);

  return (
    <div className="bg-light-blue-500 min-h-screen flex justify-center items-center">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-5" style={{ backgroundColor: "#E4E9F2" }}>
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
              onClick={() => navigate("/HomePage")} // חזרה למסך הבית
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
          </header>
          <h1
            className="text-dark-blue-500"
            style={{
              margin: "0 auto",
              textAlign: "center",
              fontSize: "20px",
              color: "#070A40",
            }}
          >
            <b>Template Preview</b>
          </h1>
          <div style={{ borderColor: "#070A40", marginTop: "20px", width: "100%" }} className="form-card">
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  marginRight: "auto",
                  fontSize: "14px",
                  color: "#070A40",
                  position: "relative",
                  top: "-3px",
                }}
              >
                <b>Name: </b> {selectedTemplate.templateName}
              </span>
            </div>
            <div
              style={{
                borderBottom: "1px solid silver",
                width: "100%",
                marginBottom: "1rem",
              }}
            ></div>
            {items.map((block) => (
              <div
                key={block.blockNo}
                className="block"
                style={{
                  border: "1px solid #070A40",
                  marginBottom: "1rem",
                  borderRadius: "0.6rem",
                  padding: "0.5rem",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "0.5rem" }}>
                  <h3 className="block-title" style={{ marginBottom: "0.2rem" }}>{block.title}</h3>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid silver",
                    width: "100%",
                    marginBottom: "1rem",
                  }}
                ></div>
                {block.type === "file" && <input type="file" disabled />}
                {block.type === "signature" && block.image && (
                  <img src={block.image} alt="Signature" />
                )}
                {block.type === "textarea" && (
                  <textarea
                    className="block-textarea"
                    placeholder="free text area..."
                    value={block.text}
                    readOnly
                    style={{ padding: "0.5rem" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateToDictate;
