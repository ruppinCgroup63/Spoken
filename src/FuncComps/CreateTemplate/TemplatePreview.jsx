import "regenerator-runtime/runtime"; // גורם לתמיכה של פונקציות אסינכרוניות ובגינרטורס
import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

function TemplateToDictate() {


  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTemplate, Data } = location.state || {}; //data is the items array
  const [items, setItems] = useState(Data || []);

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
    if (!selectedTemplate || !Data) {
      console.error("No template data found!");
      return;
    }
  }, [selectedTemplate, Data]);




  console.log(items);
  console.log(selectedTemplate);

  return (
    <div className="bg-light-blue-500 min-h-screen flex justify-center items-center">
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
          
          <div
            className="card w-full max-w-md bg-base-100 shadow-xl p-5"
            style={{ backgroundColor: "#E4E9F2" }}
          >

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
                marginRight: "-15px",
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
            <div className="card-body flex items-center justify-center">
              <div
                style={{
                  margin: "10px",
                  padding: "10px",
                  minHeight: "300px",
                  border: "1px solid #070A40",
                  position: "relative",
                  borderRadius: "0.6rem",
                }}
              >
                <div>
                </div>
                <div>
                  <h2>{selectedTemplate.templateName}</h2>
                  <h2>{selectedTemplate.description}</h2>
                  {items.map((block) => (
                    <div
                      key={block.blockNo}
                      style={{
                        border: "1px solid black",
                        margin: "10px",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <h3>Block : {block.title}</h3>
                      
                      {block.type == "file" && <input type="file" disabled />}
                      {block.type == "signature" && block.image && (
                        <img src={block.image} alt="Signature" />
                      )}
                      {block.type == "textarea" && (
                        <textarea
                          value={block.text}
                          readOnly
                          style={{
                            width: "100%",
                            height: "100px",
                            border: "1px solid silver",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateToDictate;
