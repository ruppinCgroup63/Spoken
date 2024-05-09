import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "./style.css";

const ItemType = "DRAGGABLE_ITEM";

const DraggableItem = ({ item, index, moveItem, updateItem }) => {
  const [showKeywordInput, setShowKeywordInput] = useState(false);
  const [keyword, setKeyword] = useState(item.keyword || item.title); // ערך ברירת מחדל

  // Drag logic
  const [, drag] = useDrag(
    () => ({
      type: ItemType,
      item: { id: item.id, index },
    }),
    [index, item.id]
  );

  // Drop logic
  const [, drop] = useDrop(
    () => ({
      accept: ItemType,
      hover(draggedItem, monitor) {
        if (draggedItem.index !== index) {
          moveItem(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    }),
    [index]
  );

  // כאשר הכפתור נלחץ, עובר למצב עריכת תיבת הטקסט
  const handleKeywordToggle = () => {
    setShowKeywordInput(true);
  };

  // כאשר מילת המפתח משתנה, היא נשמרת במצב מקומי ובאובייקט הכללי
  const handleKeywordChange = (e) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
    updateItem(index, "keyword", newKeyword);
  };

  // כאשר תיבת הטקסט מאבדת פוקוס, הכפתור חוזר לנראות המקורית
  const handleKeywordBlur = () => {
    setShowKeywordInput(false);
  };

  return (
    <ResizableBox
      width={300}
      height={100}
      minConstraints={[100, 100]}
      maxConstraints={[350, 100]}
      resizeHandles={["e", "w"]}
      className="resizable"
      style={{ margin: "auto" }} // מרכז את התיבה בתוך ה-div
    >
      <div
        ref={(node) => drag(drop(node))}
        style={{
          padding: "5px",
          overflow: "hidden",
          position: "relative",
          border: "1px solid silver",
        }}
      >
        <input
          type="text"
          placeholder="Enter title"
          value={item.title}
          onChange={(e) => updateItem(index, "title", e.target.value)}
          style={{
            width: "100%",
            marginBottom: "5px",
            border: "1px solid silver",
          }}
        />
        <textarea
          placeholder="Enter text"
          value={item.text}
          onChange={(e) => updateItem(index, "text", e.target.value)}
          style={{ width: "100%", height: "45px", border: "1px solid silver" }}
        />
        {showKeywordInput ? (
          <input
            type="text"
            placeholder="Keyword"
            value={keyword}
            onChange={handleKeywordChange}
            onBlur={handleKeywordBlur}
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
        ) : (
          <button
            onClick={handleKeywordToggle}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#28a745", // צבע ירוק רקע
              color: "white",
              padding: "0 8px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
            }}
          >
            <img
              src="/public/createTemplate/buttonAdd.png"
              alt="button"
              style={{ width: "16px", height: "16px" }}
            />
          </button>
        )}
      </div>
    </ResizableBox>
  );
};

export default DraggableItem;
