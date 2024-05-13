import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "react-resizable/css/styles.css";
import DraggableItem from "./CreateBlockForTemplate3";

const apiUrlTemplate = 'https://localhost:44326/api/Templates';
const apiUrlBlock = 'https://localhost:44326/api/BlocksInTemplates';

function CreateTemplate3() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [template, setTemplate] = useState(
    state.template || { TemplateName: "", description: "", IsPublic: false }
  );
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(state.items || []);

  //const handleToggle = () => {
   // setIsOpen(!isOpen);
  //};

const updateItem = useCallback(
  (index, field, value) => {
    const newItems = items.map((item, idx) => 
      idx === index ? { ...item, [field]: value } : item
    );
    setItems(newItems);  // עדכון המערך 
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

  //שליחה לשרת את התבנית והבלוקים
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Fetch to template
    fetch(apiUrlTemplate, {
      method: 'POST',
      body: JSON.stringify(template),
      headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8',
      }
    })
    .then(res => {
      console.log('res=', res);
      return res.json();
    })
    .then((result) => {
      console.log("fetch POST= ", 'Create Template successfully');
      console.log(result.template);
      
      // after successful template creation,continue with POST block
      items.forEach(block => {
        fetch(apiUrlBlock, {
          method: 'POST',
          body: JSON.stringify(block),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
          }
        })
        .then(res => {
          console.log('res=', res);
          return res.json();
        })
        .then(result => {
          console.log("Block inserted successfully:", result);
        })
        .catch(error => {
          console.error("Error posting block:", error);
        });
      });
  
      // Navigate after successful
      navigate("/HomePage", {
        state: { template, items, origin: "CreateTemplate3" },
      });
    })
    .catch((error) => {
      console.log("err post=", 'the template already exists');
      console.log(error);
    });
  };
  
  
  console.log(items);



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
                <div className="step step-primary" data-content="✓">
                  Structure
                </div>
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
                      top: "-3px",
                    }}
                  >
                    <b>Name:</b> {template.TemplateName}
                  </span>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid silver",
                    width: "100%",
                    marginBottom: "2rem",
                  }}
                ></div>

                {/* חלק של מילת המפתח */}
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
                    <p className="keyWordP" style={{textAlign: "left"}}>
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

                <div className="container">
                  {items.map((item, index) => {
                    if (item.type === "file") {
                      return (
                        <div key={index}>
                          <input
                            type="file"
                            onChange={(e) => {
                              // Handle file upload
                            }}
                          />
                        </div>
                      );
                    }
                    return (
                      <DraggableItem
                        key={index}
                        item={item}
                        index={index}
                        moveItem={moveItem}
                        updateItem={updateItem}
                      />
                    );
                  })}
                </div>
                <label className="label cursor-pointer justify-start space-x-2">
                  <span className="label-text">Make template public?</span>
                  <input
                    style={{
                      borderColor: "#070A40",
                      backgroundColor: template.IsPublic
                        ? "#070A40"
                        : "#E4E9F2",
                    }}
                    type="checkbox"
                    checked={template.IsPublic}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        IsPublic: e.target.checked,
                      })
                    }
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
               
                  onClick={() =>
                    navigate("/CreateTemplate2", {
                      state: {
                        template,
                        items,
                        origin: "CreateTemplate3",
                      },
                    })
                  }
                  className="btn btn-outline btn-primary new btn-sm back"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm continue"
                 
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
