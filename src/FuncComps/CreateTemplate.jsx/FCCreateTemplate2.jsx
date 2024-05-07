import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
//import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import DraggableItem_ForTemplate2 from "./CreateBlockForTemplate2";

function CreateTemplate2() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [items, setItems] = useState(state.items || []);
  const [template, setTemplate] = useState(state.template || { name: "" });

  const changeTemplateName = () =>{
    setTemplate({ ...template, name: e.target.value })

  } 
  const addItem = useCallback((type) => {
    const id = Math.random().toString(36).substring(2, 9);
    setItems((items) => [
      ...items,
      { id, type, title: "", text: "", keyword: "" },
    ]);
  }, []);

  const removeItem = useCallback((index) => {
    setItems((items) => items.filter((_, i) => i !== index));
  }, []);

  const moveItem = useCallback((dragIndex, hoverIndex) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      const dragItem = updatedItems[dragIndex];
      updatedItems.splice(dragIndex, 1);
      updatedItems.splice(hoverIndex, 0, dragItem);
      return updatedItems;
    });
  }, []);

  const updateItem = useCallback((index, field, value) => {
    setItems((currentItems) =>
      currentItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/CreateTemplate3", {
      state: { template, items, origin: "CreateTemplate2" },
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
                <div className="step step-primary" data-content="✓">
                  Name
                </div>
                <div className="step step-primary">Template structure</div>
                <div className="step">Key Words</div>
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
                <b>template structure</b>
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
                 {/*צריך לעשות את הכפתור עריכה */}
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
                  <button
                    style={{
                      backgroundColor: "#04D9B2",
                      color: "#E4E9F2",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      borderRadius: '6rem',
                      position: "relative",
                      top: "-3px"
                    }}
                    onClick={() => {
                      <input
                        type="text"
                        value={template.name}
                        onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                        style={{
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          padding: "5px",
                        }}
                      />
                    }}
                  >
                    <img
                      src="/public/createTemplate/Edit.png"
                      alt="Error"
                      onClick={()=>changeTemplateName}
                    />
                  </button>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid silver",
                    width: "100%",
                    marginBottom: "2rem",
                  }}
                ></div>

                {items.map((item, index) => (
                  <DraggableItem_ForTemplate2
                    key={item.id}
                    item={item}
                    index={index}
                    moveItem={moveItem}
                    updateItem={updateItem}
                    removeItem={removeItem}
                  />
                ))}
              </div>


              <div className="flex items-center justify-start mt-6 bg-white p-2 rounded-lg">
                <img
                  src="/public/createTemplate/add_box.png"
                  alt="Error"
                  onClick={() => addItem("textarea")}
                />
                <span style={{marginLeft:'0.5rem',color:"#070A40"}}>
                   text box 
                   </span>
              </div>


              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/CreateTemplate")}
                  className="btn btn-outline btn-primary"
                  style={{
                    color: "#070A40",
                    backgroundColor: "rgba(255, 255, 255, 0)",
                    borderColor: "#070A40",
                  }}
                >
                  Back
                </button>
                <button type="submit" className="btn btn-primary"
                  style={{
                    backgroundColor: "#070A40",
                    color: "#E4E9F2",
                    borderColor: "#070A40",
                  }}>
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default CreateTemplate2;
