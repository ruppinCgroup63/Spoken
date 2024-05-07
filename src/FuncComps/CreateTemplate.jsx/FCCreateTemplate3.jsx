import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "./createTemplat3.css"

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
        style={{
          padding: "5px",
          overflow: "hidden",
          position: "relative",
          border: "1px solid silver",
        }}
      >
        <input
          type="text"
          placeholder=" Enter title"
          value={item.title}
          onChange={(e) => updateItem(index, "title", e.target.value)}
          style={{
            width: "100%",
            marginBottom: "5px",
            border: "1px solid  silver",
          }}
        />
        <textarea
          placeholder=" Enter text"
          value={item.text}
          onChange={(e) => updateItem(index, "text", e.target.value)}
          style={{ width: "100%", height: "45px", border: "1px solid  silver" }}
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
  const [template, setTemplate] = useState(
    state.template || { name: "", description: "", isPublic: false }
  );
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const updateItem = useCallback(
    (index, field, value) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
    },
    [items]
  );

  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
      const newItems = [...items];
      const dragItem = newItems[dragIndex];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, dragItem);
    },
    [items]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/HomePage", {
      state: { template, items, origin: "CreateTemplate3" },
    });
  };
  console.log(template);
  console.log(items);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
        <div className="card w-full max-w-md bg-base-100 shadow-xl p-5" style={{ backgroundColor: "#E4E9F2" }}>
          <div className="card-body flex items-center justify-center">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="steps space-x-2 mb-4" >
                <div className="step step-primary" style={{ color: "#070A40" }} data-content="✓">
                  Name
                </div>
                <div className="step step-primary">Structure</div>
                <div className="step step-primary">Key Words</div>
              </div>
              <h3 className="text-dark-blue-500" style={{ margin: '0 auto', textAlign: 'center', fontSize: '20px', color: "#070A40" }}><b>Key Words</b></h3>
              
              <div
                style={{
                  margin: "10px",
                  padding: "10px",
                  minHeight: "300px",
                  border: "1px solid #070A40",
                  position: "relative",
                  borderRadius:"0.6rem"
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: 'auto',fontSize:'14px',color: "#070A40"}}> <b> Name:</b> {template.name}</span>
                </div>
                <div style={{ borderBottom: '1px solid silver', width: '100%' ,marginBottom:'2rem' }}></div>



                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <span style={{ marginRight: 'auto',color:"#070A40" }}>  <span style={{ color: 'red' }}><b>*</b></span> <b>Defining keywords</b> </span>
                  
                  <div className="info-container">
                <span style={{ color: "#2D37EC" }} className={`cursor-pointer info-title ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
                 More info
                  <span className={`arrow ${isOpen ? "arrow-up" : "arrow-down"}`}></span> 
                </span>             
              </div>     
                </div>
                {isOpen && (
                  <div>
                    <p className="keyWordP">
                      In this page, you need to define a keyword for each block. The keyword will assist you during the automated transcription process. When you speak the keyword, the transcription will start writing into that specific block. By default, the text's title is set as the keyword, but you can change it to any word you prefer.
                    </p>
                  </div>
                )}
                <div style={{ borderBottom: '1px solid silver', width: '100%' ,marginBottom:'2rem' }}></div>




                <div className="container">
                  {items.map((item, index) => (
                    <DraggableItem
                      key={index}
                      item={item}כן
                      index={index}
                      moveItem={moveItem}
                      updateItem={updateItem}
                    />
                  ))}
                </div>
                <label className="label cursor-pointer justify-start space-x-2">
                  <span className="label-text">Make template public?</span>
                  <input
                    style={{ borderColor: '#070A40', backgroundColor: template.isPublic ? '#070A40' : '#E4E9F2' }}
                    type="checkbox"
                    checked={template.isPublic}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
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
                  style={{
                    color: '#070A40', backgroundColor: 'rgba(255, 255, 255, 0)', /* שקיפות מלאה */
                    borderColor: '#070A40' /* שקיפות מלאה */
                  }}
                  onClick={() =>
                    navigate("/CreateTemplate2", {
                      state: {
                        template,
                        items,
                        origin: "CreateTemplate3",
                      },
                    })
                  }
                  className="btn btn-outline btn-primary new"
                >
                  Back
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#070A40', color: '#E4E9F2', borderColor: '#070A40'}}>
                  Save template
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
