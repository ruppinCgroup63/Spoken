import React from "react";
import { useDrag, useDrop } from "react-dnd"; //מאפשרים לנו לגרור ולהוריד את הרכיבים בדף
import { ResizableBox } from "react-resizable";//מאפשר לשנות את גודל הרכיב באופן אינטראקטיבי
import "react-resizable/css/styles.css"; // עיצוב של הספרייה שמעל
import "./style.css";


const ItemType1 = "DRAGGABLE_ITEM"; // משתנה קבוע שנשתמש בו כדי להגדיר את סוג הפריטים שניתן לגרור ולהוריד

const DraggableItem_ForTemplate2 = ({ // מקבלים אובייקט פרופס שמכיל את הפרמטרים הנ"ל
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
  ); // מחזירים אובייקט שמקבל את ההתנהגות של הגרירה והוא מכיל את המאפיינים אייטם טייפ ואינדקס

  // הגדרת פעולת ההורדה כאשר פריט נגרר מעליה 
  // הגדרת פעולת ההורדה כאשר פריט נגרר מעליה 
  const [, drop] = useDrop(
    () => ({
      accept: ItemType1, //אילו פריטים יכולים להתמקם על הקופננטה הנוכחית, רק אלו שמסוג האייטם טייפ
      hover(item, monitor) { // מופעלת כאשר פריט מוחזר מעל הקומפננטה
        if (item.index !== index) { // בודקים אם האינדקס של הפריט שונה משל הקומפננטה
          moveItem(item.index, index); //אם כן מחליפים בין המיקומים וכך מאפשר להחליף בין הפריטים במערך
          item.index = index;
        }
      },
    }),
    [index]
  );

  // הגדרת התוכן לפי סוג התיבה והחזרה של תוכן התיבה לפי סוג הפריט
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
      // תיבת טקסט פלוס כותרת יחד
      return (
        <>
          <input
            type="text"
            placeholder="Enter title"
            value={item.Title}
            onChange={(e) => {
              updateItem(index, "Title", e.target.value);
              updateItem(index, "KeyWord", e.target.value); // העתק את הערך של title גם ל-keyword
            }}
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
}}      
  return (
    <ResizableBox // רכיב הניתן לשינוי גודל ונגרר
      width={300}
      height={100}
      minConstraints={[100, 100]}
      maxConstraints={[350, 100]}
      resizeHandles={["e", "w"]}
      className="resizable"
      style={{ margin: "auto" }} // Centering the boxes within the div
    >
      <div
       
        ref={(node) => drag(drop(node))} // גישה ישירה לאלמנט הדום ושליחת האובייקט שנרצה לבצע עליו את הפעולת גרירה
        style={{
          padding: "5px",
          overflow: "hidden",
          position: "relative",
          border: "1px solid silver",
          marginTop: "1rem",
        }}
      >
        <img
          src={import.meta.env.BASE_URL +"/createTemplate/Trash1.png"}
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
          onClick={() => removeItem(index)} // מסיר את התיבה אם לוחצים על הפח
        />

        {renderContent()}
         
      </div> 
          
    </ResizableBox>
  );
};

export default DraggableItem_ForTemplate2;