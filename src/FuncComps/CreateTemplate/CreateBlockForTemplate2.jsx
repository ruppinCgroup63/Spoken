import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "./style.css";

const ItemType1 = "DRAGGABLE_ITEM";

const DraggableItem_ForTemplate2 = ({
  item,
  index,
  moveItem,
  updateItem,
  removeItem,
}) => {
  // הגדרת פעולת הגרירה
  const [, drag] = useDrag(
    () => ({
      type: ItemType1,
      item: { BlockNo: item.BlockNo, index },
    }),
    [index, item.BlockNo]
  );

  // הגדרת פעולת ההורדה
  const [, drop] = useDrop(
    () => ({
      accept: ItemType1,
      hover(item, monitor) {
        if (item.index !== index) {
          moveItem(item.index, index);
          item.index = index;
        }
      },
    }),
    [index]
  );

  // הגדרת התוכן לפי סוג התיבה
  const renderContent = () => {
    if (item.Type === "file") {
      // תיבת קובץ
      return (
        <input
          type="file"
          style={{
            width: "100%",
            marginBottom: "2px",
            border: "1px solid silver",
          }}
        />
      );
    } else if (item.Type === "signature") {
      // תיבת חתימה
      return (
        <img
          src={item.image}
          alt="Signature"
          style={{
            width: "100%", // מתאים את גודל התמונה לרוחב המלא של התיבה
            maxHeight: "100px", // הגבלת הגובה המרבי של התמונה ל-100 פיקסלים
            border: "1px solid silver",
            padding: "2px",
          }}
        />
      );
    } else {
      // תיבת טקסט
      return (
        <>
          <input
            type="text"
            placeholder="Enter title"
            value={item.Title}
            onChange={(e) => updateItem(index, "Title", e.target.value)}
            style={{
              width: "100%",
              marginBottom: "2px",
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
      style={{ margin: "auto" }} // Centering the boxes within the div
    >
      <div
        ref={(node) => drag(drop(node))}
        style={{
          padding: "5px",
          overflow: "hidden",
          position: "relative",
          border: "1px solid silver",
          marginTop: "1rem",
        }}
      >
        <img
          src="/public/createTemplate/Trash1.png"
          alt="Delete"
          style={{
            height: "65px", // גובה התמונה
            width: "65px", // רוחב התמונה
            position: "absolute",
            top: "-14.5px",
            right: "-10px",
            cursor: "pointer",
            zIndex: 10,
          }} // עיצוב מותאם לגודל התמונה
          className="object-contain"
          onClick={() => removeItem(index)}
        />

        {renderContent()}
      </div>
    </ResizableBox>
  );
};

export default DraggableItem_ForTemplate2;