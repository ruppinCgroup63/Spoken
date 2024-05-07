import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "./createTemplat3.css";

const ItemType = "DRAGGABLE_ITEM";

const DraggableItem = ({ item, index, moveItem, updateItem }) => {
  const [showKeywordInput, setShowKeywordInput] = useState(false);
  const [keyword, setKeyword] = useState(item.keyword || item.title); // Default to title if keyword is not set

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

  // Toggles keyword input visibility
  const handleKeywordToggle = () => {
    setShowKeywordInput(true);
  };

  // Handles keyword value change and toggles back to button
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    updateItem(index, "keyword", e.target.value);
  };

  // When losing focus, toggle back to the button
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
      style={{ margin: "auto" }} // Centering the boxes within the div
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
              backgroundColor: "transparent", // ללא צבע רקע
              color: "#28a745", // או כל צבע שתבחרו למילת המפתח
              padding: "0",
              border: "none",
              cursor: "pointer",
              gap: "4px", // מרווח קטן בין האייקון לטקסט
            }}
          >
            <img
              src="/public/createTemplate/buttonAdd.png"
              alt="button"
              style={{ width: "16px", height: "16px" }}
            />
            {keyword}
          </button>
        )}
      </div>
    </ResizableBox>
  );
};

export default DraggableItem;
