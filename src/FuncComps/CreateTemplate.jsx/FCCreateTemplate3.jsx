import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const ItemType = "DRAGGABLE_ITEM";

const DraggableItem = ({ item, index, moveItem }) => {
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
      height={50}
      minConstraints={[100, 50]}
      maxConstraints={[350, 50]}
      resizeHandles={["e", "w"]}
      className="resizable"
    >
      <div
        ref={(node) => drag(drop(node))}
        style={{ padding: "5px", overflow: "hidden" }}
      >
        {item.type === "input" ? (
          <input
            type="text"
            defaultValue={item.text}
            style={{ width: "100%" }}
          />
        ) : (
          <textarea
            defaultValue={item.text}
            style={{ width: "100%", height: "90%" }}
          />
        )}
      </div>
    </ResizableBox>
  );
};
function CreateTemplate3() {
  const { state } = useLocation();
  const { template, items } = state; // קבלת המידע שהועבר

  const navigate = useNavigate();

  const [templateDetails, setTemplate] = useState({
    name: template ? template.name : "",
    Description: template ? template.Description : "",
  });
  console.log(template);
  console.log(items);
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/HomePage", { state: { templateDetails, items } });
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
                <div className="step step-primary" data-content="✓">
                  Structure
                </div>
                <div className="step step-primary">Key Words</div>
              </div>

              <div>
                <input
                  type="text"
                  className="input input-bordered input-sm w-full mb-4"
                  value={template.name}
                  placeholder="Template Name"
                  onChange={(e) =>
                    setTemplate({ ...template, name: e.target.value })
                  }
                />
                <div className="container">
                  {items.map((item, index) => (
                    <DraggableItem key={index} item={item} />
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/CreateTemplate2", { state: { items } })
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
