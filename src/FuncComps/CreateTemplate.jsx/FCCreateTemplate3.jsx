import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "react-resizable/css/styles.css";
import "./createTemplat3.css";
import DraggableItem from "./CreateBlockForTemplate3";

function CreateTemplate3() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { items } = state;
  const [template, setTemplate] = useState(
    state.template || { name: "", description: "", isPublic: false }
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const updateItem = useCallback(
    (index, field, value) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
    },
    [items]
  );

  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
      const newItems = [...items];
      const dragItem = newItems[dragIndex];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, dragItem);
    },
    [items]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/HomePage", {
      state: { template, items, origin: "CreateTemplate3" },
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
        <div
          className="card w-full max-w-md bg-base-100 shadow-xl p-5"
          style={{ backgroundColor: "#E4E9F2" }}
        >
          <div className="card-body flex items-center justify-center">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="steps space-x-2 mb-4">
                <div
                  className="step step-primary"
                  style={{ color: "#070A40" }}
                  data-content="✓"
                >
                  Name
                </div>
                <div className="step step-primary" data-content="✓">Structure</div>
                <div className="step step-primary">Key Words</div>
              </div>
              <h3
                className="text-dark-blue-500"
                style={{
                  margin: "0 auto",
                  textAlign: "center",
                  fontSize: "20px",
                  color: "#070A40",
                }}
              >
                <b>Key Words</b>
              </h3>

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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      marginRight: "auto",
                      fontSize: "14px",
                      color: "#070A40",
                      position: "relative",
                      top: "-3px" 
                    }}
                  >
                    <b>Name:</b> {template.name}
                  </span>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid silver",
                    width: "100%",
                    marginBottom: "2rem",
                  }}
                ></div>
                {/* חלק של מילת המפתח מתחת ל-Name */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <span style={{ marginRight: "auto", color: "#070A40" }}>
                    <span style={{ color: "red" }}>
                      <b>*</b>
                    </span>{" "}
                    <b>Defining keywords</b>
                  </span>
                  <div className="info-container">
                    <span
                      style={{ color: "#2D37EC" }}
                      className={`cursor-pointer info-title ${
                        isOpen ? "open" : ""
                      }`}
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      More info
                      <span
                        className={`arrow ${
                          isOpen ? "arrow-up" : "arrow-down"
                        }`}
                      ></span>
                    </span>
                  </div>
                </div>
                {isOpen && (
                  <div>
                    <p className="keyWordP">
                      In this page, you need to define a keyword for each block.
                      The keyword will assist you during the automated
                      transcription process. When you speak the keyword, the
                      transcription will start writing into that specific block.
                      By default, the text's title is set as the keyword, but
                      you can change it to any word you prefer.
                    </p>
                  </div>
                )}
                <div
                  style={{
                    borderBottom: "1px solid silver",
                    width: "100%",
                    marginBottom: "2rem",
                  }}
                ></div>

                {/* יתר הקוד נשאר כרגיל */}
                <div className="container">
                  {items.map((item, index) => (
                    <DraggableItem
                      key={index}
                      item={item}
                      index={index}
                      moveItem={moveItem}
                      updateItem={updateItem}
                    />
                  ))}
                </div>
                <label className="label cursor-pointer justify-start space-x-2">
                  <span className="label-text">Make template public?</span>
                  <input
                    style={{
                      borderColor: "#070A40",
                      backgroundColor: template.isPublic
                        ? "#070A40"
                        : "#E4E9F2",
                    }}
                    type="checkbox"
                    checked={template.isPublic}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        isPublic: e.target.checked,
                      })
                    }
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  style={{
                    color: "#070A40",
                    backgroundColor: "rgba(255, 255, 255, 0)",
                    borderColor: "#070A40",
                  }}
                  onClick={() =>
                    navigate("/CreateTemplate2", {
                      state: {
                        template,
                        items,
                        origin: "CreateTemplate3",
                      },
                    })
                  }
                  className="btn btn-outline btn-primary new"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "#070A40",
                    color: "#E4E9F2",
                    borderColor: "#070A40",
                  }}
                >
                  Save template
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default CreateTemplate3;