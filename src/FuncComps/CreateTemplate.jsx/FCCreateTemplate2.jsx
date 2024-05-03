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
    >
      <div
        ref={(node) => drag(drop(node))}
        style={{ padding: "5px", overflow: "hidden" }}
      >
        <input
          type="text"
          placeholder="Enter title"
          defaultValue={item.title}
          onChange={(e) => updateItem(index, "title", e.target.value)}
          style={{ width: "100%", marginBottom: "5px" }}
        />
        <textarea
          placeholder="Enter text"
          defaultValue={item.text}
          onChange={(e) => updateItem(index, "text", e.target.value)}
          style={{ width: "100%", height: "45px" }}
        />
      </div>
    </ResizableBox>
  );
};

function CreateTemplate2() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [items, setItems] = useState([]);
  const [template, setTemplate] = useState({ name: "" });

  console.log(state);
  // טעינת נתונים כאשר הקומפוננטה נטענת או כאשר משתנה ה-state
  useEffect(() => {
    if (state) {
      setTemplate(state.template);
      if (state.origin === "CreateTemplate3") {
        setItems(state.items);
        setTemplate(state.templateDetails);
      }
    }
  }, [state]);
  console.log(items);
  console.log(state.templateDetails);

  //const addItem = useCallback((type) => {
  //const id = Math.random().toString(36).substring(2, 9);
  //setItems((items) => [
  //...items,
  //{ id, type, text: type === "input" ? "כותרת" : "פסקה" },
  //]);
  //}, []);

  const addItem = useCallback((type) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newItem = {
      id,
      type,
      title: "", // כותרת חדשה לפריט
      text: "", // טקסט חדש לפריט
      keyword: "", // אפשרות להוסיף מילת מפתח כבר ביצירה
    };
    setItems((items) => [...items, newItem]);
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
      currentItems.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(template);
    navigate("/CreateTemplate3", {
      state: { template, items, origin: "CreateTemplate2" },
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
                <div className="step step-primary">Template structure</div>
                <div className="step">
                  Key<br></br>words
                </div>
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
                  <DraggableItem
                    key={item.id}
                    item={item}
                    index={index}
                    moveItem={moveItem}
                  />
                ))}
              </div>

              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  className="btn btn-success btn-outline"
                  onClick={() => addItem("input")}
                >
                  הוסף כותרת
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-outline"
                  onClick={() => addItem("textarea")}
                >
                  הוסף פיסקה
                </button>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/CreateTemplate", {
                      state: { template, origin: "CreateTemplate2" },
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

export default CreateTemplate2;
