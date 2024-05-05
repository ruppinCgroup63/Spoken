import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const ItemType = "DRAGGABLE_ITEM";

const DraggableItem = ({ item, index, moveItem, updateItem }) => {
  const [, drag] = useDrag(
    () => ({
      type: ItemType,
      item: { id: item.id, index },
    }),
    [index, item.id]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemType,
      hover(item, monitor) {
        if (item.index !== index) {
          moveItem(item.index, index);
          item.index = index;
        }
      },
    }),
    [index]
  );

  return (
    <ResizableBox
      width={300}
      height={100}
      minConstraints={[100, 100]}
      maxConstraints={[350, 100]}
      resizeHandles={["e", "w"]}
      className="resizable"
      style={{ margin: "auto" }} // Centering the boxes within the div
    >
      <div
        ref={(node) => drag(drop(node))}
        style={{ padding: "5px", overflow: "hidden", position: "relative",border: "1px solid  silver" }}
      >
        <input
          type="text"
          placeholder=" Enter title"
          value={item.title}
          onChange={(e) => updateItem(index, "title", e.target.value)}
          style={{ width: "100%", marginBottom: "5px" ,border: "1px solid  silver"}}
        />
        <textarea
          placeholder=" Enter text"
          value={item.text}
          onChange={(e) => updateItem(index, "text", e.target.value)}
          style={{ width: "100%", height: "45px", border: "1px solid  silver"}}
        />
        <input
          type="text"
          placeholder="Keyword"
          value={item.keyword || item.title} // Default to title if keyword is not set
          onChange={(e) => updateItem(index, "keyword", e.target.value)}
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            width: "auto",
            padding: "3px",
            fontSize: "12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>
    </ResizableBox>
  );
};

function CreateTemplate3() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { items } = state;
  const [templateDetails, setTemplateDetails] = useState(
    state.templateDetails || { name: "", description: "", isPublic: false }
  );

  const updateItem = useCallback(
    (index, field, value) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      // Assuming `items` is part of the state, this might actually need a setter
    },
    [items]
  );

  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
      const newItems = [...items];
      const dragItem = newItems[dragIndex];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, dragItem);
      // Assuming `items` is part of the state, this might actually need a setter
    },
    [items]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/HomePage", {
      state: { templateDetails, items, origin: "CreateTemplate3" },
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex items-center justify-center bg-light-blue-500 py-10">
        <div className="card max-w-lg mx-auto bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="steps space-x-2 mb-4">
                <div className="step step-primary" data-content="✓">
                  Name
                </div>
                <div className="step step-primary">Structure</div>
                <div className="step step-primary">Key Words</div>
              </div>
              <h3 className="card-title text-dark-blue-500">Key Words</h3>
              <p>
                In this page, you need to define a keyword for each block. The
                keyword will assist you during the automated transcription
                process. When you speak the keyword, the transcription will
                start writing into that specific block. By default, the text's
                title is set as the keyword, but you can change it to any word
                you prefer.
              </p>
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
                  className="input input-bordered input-sm w-full mb-4"
                  value={templateDetails.name}
                  placeholder="Template Name"
                  onChange={(e) =>
                    setTemplateDetails({
                      ...templateDetails,
                      name: e.target.value,
                    })
                  }
                />
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
                    type="checkbox"
                    checked={templateDetails.isPublic}
                    onChange={(e) =>
                      setTemplateDetails({
                        ...templateDetails,
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
                  onClick={() =>
                    navigate("/CreateTemplate2", {
                      state: {
                        templateDetails,
                        items,
                        origin: "CreateTemplate3",
                      },
                    })
                  }
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

export default CreateTemplate3;
