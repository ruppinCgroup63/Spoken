import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "./style.css";

const ItemType = "DRAGGABLE_ITEM";

const DraggableItem = ({ item, index, moveItem, updateItem }) => {
  const [showKeywordInput, setShowKeywordInput] = useState(false); // ניהול התיבה של מילת המפתח
  const [KeyWord, setKeyword] = useState(item.KeyWord || item.Title); // ערך ברירת מחדל מה-Title

  // Drag logic - גרירה
  const [, drag] = useDrag(
    () => ({
      type: ItemType,
      item: { BlockNo: item.BlockNo, index },
    }),
    [index, item.BlockNo] // כל שינוי באחד מהערכים האלה יגרום להפעלה מחדש של הפונקציה 
  );

  // Drop logic -- שחרור הפריט
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

  //לחיצה על הכפתור תציג את המלל בתיבה ותאפשר לכתוב
  const handleKeywordToggle = () => {
    setShowKeywordInput(true);
  };

  //אם משנים את הטקסט נרצה לעדכן את המילת מפתח
  const handleKeywordChange = (e) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
  };

  //עדכון המילת מפתח בבלוק והסתרת תיבת הטקסט של המפתח
  const handleKeywordBlur = () => {
    updateItem(index, "KeyWord", KeyWord);
    setShowKeywordInput(false);
  };

  //מחזירים את התוכן שמותאם לפריט
  const renderContent = () => {
    if (item.Type === "file") {
      return (
        <input
          type="file"
          style={{
            width: "100%",
            marginBottom: "5px",
            border: "1px solid silver",
          }}
        />
      );
    } else if (item.Type === "signature") {
      return (
        <img
          src={item.image}
          alt="Signature"
          style={{
            width: "100%",
            maxHeight: "100px",
            border: "1px solid silver",
            padding: "5px",
          }}
        />
      );
    } else {
      return (
        <>
          <input
            type="text"
            placeholder="Enter title"
            value={item.Title}
            onChange={(e) => {
              updateItem(index, "Title", e.target.value);
            }}
            style={{
              width: "100%",
              marginBottom: "5px",
              border: "1px solid silver",
            }}
          />
          <textarea
            placeholder="Enter text"
            value={item.Text}
            onChange={(e) => updateItem(index, "Text", e.target.value)}
            style={{
              width: "100%",
              height: "45px",
              border: "1px solid silver",
            }}
          />
        </>
      );
    }
  };

  return (
    <ResizableBox
      width={300}
      height={100}
      minConstraints={[100, 100]}
      maxConstraints={[350, 100]}
      resizeHandles={["e", "w"]}
      className="resizable"
      style={{ margin: "auto" }}
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
        {renderContent()}

        {showKeywordInput ? (
          <input
            type="text"
            placeholder="Keyword"
            value={KeyWord}
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
              //backgroundColor: "#28a745",
              color: "white",
              padding: "0 8px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
            }}
          >
             {item.Type !== "file" && item.Type !== "signature" && (
          <img
            src="/public/createTemplate/keyword.png"
            alt="Keyword"
            style={{
            position:"relative",
            top: "-16px",
            right: "-17px",
            marginLeft:"2rem"
   
            }}
          />
        )}
          </button>
        )}
      </div>
    </ResizableBox>
  );
};

export default DraggableItem;
