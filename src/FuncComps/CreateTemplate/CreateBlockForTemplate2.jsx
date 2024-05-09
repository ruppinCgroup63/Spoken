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
  const [, drag] = useDrag(
    () => ({
      type: ItemType1,
      item: { id: item.id, index },
    }),
    [index, item.id]
  );

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

  const renderContent = () => {
    if (item.type === "file") {
      // תיבת קובץ 
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
    } else {
      // תיבת טקסט 
      return (
        <>
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
      height={item.type === "file" ? 60 : 100}
      minConstraints={[100, 60]}
      maxConstraints={[350, item.type === "file" ? 60 : 100]}
      resizeHandles={["e", "w"]}
      className="resizable"
      style={{ margin: "auto", marginTop: "2rem" }} // Centering the boxes within the div
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
        <button
          onClick={() => removeItem(index)}
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            zIndex: 10,
            backgroundColor: "#04D9B2",
            color: "black",
            width: "1.8rem",
          }}
          className="btn btn-xs"
        >
          <img
            src="/public/createTemplate/Trash.png"
            alt="Delete"
            style={{ 
              height: "65px", // גובה התמונה
              width: "65px",  // רוחב התמונה
              position: "absolute",
              top: "-14px",      
              right: "-10px", 
              cursor: "pointer",
            
              zIndex: 10, }} // עיצוב מותאם לגודל התמונה
            className="object-contain"
            onClick={() => removeItem(index)}
          />
        </button>
        {renderContent()}
      </div>
    </ResizableBox>
  );
};

export default DraggableItem_ForTemplate2;
