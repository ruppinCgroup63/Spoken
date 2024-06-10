import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd"; // ייבוא של הספרייה שמאפשרת גרירה והורדה
import { HTML5Backend } from "react-dnd-html5-backend";
import "react-resizable/css/styles.css";
import DraggableItem_ForTemplate2 from "./CreateBlockForTemplate2";

function CreateTemplate2() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [items, setItems] = useState(state.items || []);
  const [template, setTemplate] = useState(state.template || { TemplateName: "" });
  const [nextBlockNumber, setNextBlockNumber] = useState(1);

  const addTextBox = useCallback((Type) => {
    const BlockNo = nextBlockNumber;
    setNextBlockNumber(nextBlockNumber + 1);

    setItems((items) => [
      ...items,
      {
        TemplateNo: template.TemplateNo,
        BlockNo,
        Type,
        Title: "",
        Text: "",
        KeyWord: "",
        IsActive: false,
        IsMandatory: false,
      },
    ]);
  }, [nextBlockNumber, template.TemplateNo]);

  const addSignature = useCallback(() => {
    const BlockNo = nextBlockNumber;
    setNextBlockNumber(nextBlockNumber + 1);

    setItems((items) => [
      ...items,
      {
        TemplateNo: template.TemplateNo,
        BlockNo,
        Type: "signature",
        Title: "",
        Text: "",
        KeyWord: "",
        IsActive: false,
        IsMandatory: false,
        image: template.Signature,
      },
    ]);
  }, [nextBlockNumber, template.TemplateNo]);

  const addFile = useCallback(() => {
    const BlockNo = nextBlockNumber;
    setNextBlockNumber(nextBlockNumber + 1);

    setItems((items) => [
      ...items,
      {
        TemplateNo: template.TemplateNo,
        BlockNo,
        Type: "file",
        Title: "",
        Text: "",
        KeyWord: "",
        IsActive: false,
        IsMandatory: false,
      },
    ]);
  }, [nextBlockNumber, template.TemplateNo]);

  //פונקציה שמסירה פריט מאייטמס (מהבלוקים) לפי אינדקס
  const removeItem = useCallback((index) => {
    setItems((items) => items.filter((_, i) => i !== index));
  }, []);

  // פונקציה שמזיזה פריט (בלוק) בתוך אייטמס לפי האינדקסים דראג זה הפריט שנגרר והובר זה הפריט שמעליו הוא מונח
  const moveItem = useCallback((dragIndex, hoverIndex) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      const dragItem = updatedItems[dragIndex]; // שמירת הפריט הנגרר
      updatedItems.splice(dragIndex, 1); //מסירה פריט אחד בלבד מהמערך באינדקס המצויין
      updatedItems.splice(hoverIndex, 0, dragItem); // מוסיפים את האייטם באינדקס של הובר והמס' אפס אומר שאנחנו לא מסירים שום פריט
      return updatedItems;
    });
  }, []);

  // מעדכנת בלוק מסויים באייטמס לפי אינדקס שדה וערך למשל עדכון הכותרת או המילת מפתח
  const updateItem = useCallback((index, field, value) => {
    setItems((currentItems) =>
      currentItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }, []);

  console.log(items);

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
                <div className="step step-primary">Template Structure</div>
                <div className="step">Key Words</div>
              </div>
              <h3
                className="text-dark-blue-500"
                style={{
                  margin: "0 auto",
                  textAlign: "center",
                  fontSize: "20px",
                  color: "#070A40",
                }}
              >
                <b>Template Structure</b>
              </h3>
              <div
                style={{
                  margin: "10px",
                  padding: "10px",
                  minHeight: "300px",
                  border: "1px solid #070A40",
                  position: "relative",
                  borderRadius: "0.6rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      marginRight: "auto",
                      fontSize: "14px",
                      color: "#070A40",
                    }}
                  >
                    <b>Name:</b> {template.TemplateName}
                  </span>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid silver",
                    width: "100%",
                    marginBottom: "2rem",
                  }}
                ></div>
                {items.map((item, index) => ( // מפה על כל הבלוקים ומציג כל אחד מהם עם האופציה לגרור ולהוריד
                  <DraggableItem_ForTemplate2 
                    key={item.BlockNo} // העברת הפרופס דרך התווית באופן ישיר
                    item={item}//מעבירה כל אחד מהאייטמים לקומפננטה של היצירת בלוקים 
                    index={index}
                    moveItem={moveItem}
                    updateItem={updateItem}
                    removeItem={removeItem}
                  />
                ))}
              </div>

              <div className="flex items-center justify-start mt-6 bg-white p-2 rounded-lg">
                <img
                  src="/public/createTemplate/add_box.png"
                  alt="Error"
                  onClick={() => addTextBox("textarea")}
                  style={{ cursor: "pointer" }}
                />
                <span
                  style={{
                    marginLeft: "0.5rem",
                    color: "#070A40",
                    cursor: "pointer",
                  }}
                  onClick={() => addTextBox("textarea")}
                >
                  Text Box
                </span>
              </div>
              <div className="flex items-center justify-start mt-6 bg-white p-2 rounded-lg">
                <img
                  src="/public/createTemplate/add_box.png"
                  alt="Error"
                  onClick={addFile}
                  style={{ cursor: "pointer" }}
                />
                <span
                  style={{
                    marginLeft: "0.5rem",
                    color: "#070A40",
                    cursor: "pointer",
                  }}
                  onClick={addFile}
                >
                  Import File
                </span>
              </div>
              <div className="flex items-center justify-start mt-6 bg-white p-2 rounded-lg">
                <img
                  src="/public/createTemplate/add_box.png"
                  alt="Error"
                  onClick={addSignature}
                  style={{ cursor: "pointer" }}
                />
                <span
                  style={{
                    marginLeft: "0.5rem",
                    color: "#070A40",
                    cursor: "pointer",
                  }}
                  onClick={addSignature}
                >
                  Signature
                </span>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/CreateTemplate")}
                  className="btn btn-outline btn-primary btn-sm"
                  style={{
                    color: "#070A40",
                    backgroundColor: "rgba(255, 255, 255, 0)",
                    borderColor: "#070A40",
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{
                    backgroundColor: "#070A40",
                    color: "#E4E9F2",
                    borderColor: "#070A40",
                  }}
                >
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
