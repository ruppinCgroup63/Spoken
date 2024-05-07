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
              <h3 className="card-title text-dark-blue-500">
                Template structure
              </h3>
              <div
                style={{
                  margin: "10px",
                  padding: "10px",
                  minHeight: "300px",
                  border: "2px solid black",
                  position: "relative",
                }}
              >
                <input
                  type="text"
                  className="input input-bordered input-sm w-full"
                  value={template.name}
                  placeholder="Template Name"
                  onChange={(e) =>
                    setTemplate({ ...template, name: e.target.value })
                  }
                />
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
              <div
                className="flex gap-2 justify-center"
                style={{ marginTop: "2rem" }}
              >
                <button
                  type="button"
                  className="btn btn-success btn-outline"
                  onClick={() => addItem("textarea")}
                >
                  Add Section
                </button>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/CreateTemplate")}
                  className="btn btn-outline btn-primary"
                >
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
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
