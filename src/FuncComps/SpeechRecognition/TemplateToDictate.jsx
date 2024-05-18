import "regenerator-runtime/runtime";
import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useLocation, useNavigate } from "react-router-dom";

function TemplateToDictate() {
  //URL for the spelling - הכתובת לשרת לפרוצדורה של תיקון התמלול
  const apiUrlBlockCorrector = "https://localhost:44326/api/TextCorrector";
  //const apiUrlTemplate = "https://localhost:44326/api/Templates";
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTemplate, Data } = location.state || {};
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [activeKeyword, setActiveKeyword] = useState(null); // מצב עבור מילת מפתח
  const [isDictating, setIsDictating] = useState(false); // מצב כדי לעקוב אחר הכתבה ולנהל את ההכתבה לבלוקים
  const [items, setItems] = useState(Data || []); // הבלוקים אליהם נתמלל

  // Add a listener to resize the text area dynamically
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { target } = entry;
        target.style.height = "auto";
        target.style.height = target.scrollHeight + "px";
      }
    });

    const textAreas = document.querySelectorAll("textarea");
    textAreas.forEach((textarea) => {
      textarea.style.height = "auto";
      resizeObserver.observe(textarea);
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  //UseEffect עבור בדיקה האם הועברה תבנית ובלוקים של התבנית
  useEffect(() => {
    if (!selectedTemplate || !Data) {
      console.error("No template data found!");
      return;
    }
  }, [selectedTemplate, Data]);

  //התחלה הזאנה בלבד - ללא הכתבה
  const handleStartListening = () => {
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
      console.log("Started listening...");
    }
  };

  //עצירת האזנה
  //פונקציה שמטפלת בעצירת האזנה - עוצר תמלול והאזנה - מיקרופון מכובה
  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    console.log("Stop listening...");
    setActiveKeyword(null);
    setIsDictating(false);
  };

  // const handleSave = () => {
  //   if (!listening) {
  //     console.log("Saving changes to the server...");

  //     const updatedData = {
  //       email: user.email, // Assuming you have the user's email available
  //       updatedBlocks: items, // Pass the updated block data
  //     };

  //     fetch("https://localhost:44326/api/BlockInTemplate", {
  //       // Update the endpoint to correct URL
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(updatedData),
  //     })
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error("Failed to save data");
  //         }
  //         return response.json();
  //       })
  //       .then((data) => {
  //         console.log("Data saved successfully:", data);
  //         // Handle success message or further actions
  //       })
  //       .catch((error) => {
  //         console.error("Error while saving data:", error);
  //         // Handle error message or further actions
  //       });
  //   }
  // };

  //שליחה לשרת את התבנית והבלוקים
  // Save the blocks sequentially
  const handleSave = async () => {
    try {
      for (let i = 0; i < items.length; i++) {
        let block = items[i];
        const blockResponse = await fetch(apiUrlBlockCorrector, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(block),
        });

        if (!blockResponse.ok) {
          throw new Error(`HTTP error! Status: ${blockResponse.status}`);
        }

        const blockResult = await blockResponse.json();
        console.log("Block corrected successfully:", blockResult);

        // Update the state with the corrected block
        setItems((prevItems) =>
          prevItems.map((item, index) => (index === i ? blockResult : item))
        );
      }

      console.log("All blocks corrected successfully");

      // Optionally navigate to another page or show a success message
      navigate("/HomePage", {
        state: { items, origin: "CreateTemplate3" },
      });
    } catch (error) {
      console.error("Error during the POST process:", error.message);
    }
  };

  console.log(items);

  //ניהול האזנה והתמלול
  useEffect(() => {
    console.log(transcript);
    if (!isDictating) {
      handleTranscriptKeywords();
    } else if (transcript.toLowerCase().trim().endsWith("stop")) {
      handleStopDictating();
    } else {
      appendTranscriptToActiveBlock();
    }
  }, [transcript]);

  //עצירת התמלול בלבד - איפוס מילת מפתח איפוס מצב הכתבה
  const handleStopDictating = () => {
    console.log("Stop dictating - last KeyWord was ", activeKeyword);
    setIsDictating(false);
    console.log("is dictating now turn from on to : ", isDictating);
    setActiveKeyword(null);
    resetTranscript();
  };

  //פונקציה שמנהלת את ההכתבה לתוך הקומפוננטה
  const handleTranscriptKeywords = () => {
    //תנאי מקדים - בדיקה שהמערכת מאזינה
    if (!listening) {
      console.log("system is not listeting");
      return;
    }

    console.log("Items of the template are : ", items);
    //חיפוש/זיהוי מילת מפתח מתוך מילות המפתח של הבלוקים
    let foundKeyword = items.find((item) =>
      transcript.toLowerCase().endsWith(item.keyWord.toLowerCase())
    );
    console.log("Founded keyword is : ", foundKeyword);

    //במקרה ובו זוההתה מילת מפתח - ומצב הכתבה לא פועל - נפעיל אותו כדי להכתוב לבלוק המתאים
    if (foundKeyword && !isDictating) {
      setIsDictating(true);
      setActiveKeyword(foundKeyword.keyWord);
      resetTranscript();
    }
  };

  //ההכתבה לבלוק - פונקציה לניהול ההכתבה לבלוק
  const appendTranscriptToActiveBlock = () => {
    console.log(`Append transcript to ${activeKeyword}`);
    // ישנה מילת מפתח פועלת - כלומר בלוק שאליו מתמללים - וגם מצב הכתבה פועל
    if (activeKeyword && isDictating) {
      console.log(
        "In if \n",
        "Active Key Is : ",
        activeKeyword,
        "isDictating ? : ",
        isDictating
      );
      // רק אם זוהתה מילת מפתח - ומצב הכתבה פועל נעדכן את הטקסט של הבלוק - כלומר הכתבה לבלוק
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.keyWord.toLowerCase() === activeKeyword.toLowerCase()
            ? { ...item, text: (item.text || "") + " " + transcript }
            : item
        )
      );
      resetTranscript();
    }
  };

  useEffect(() => {
    if (!isDictating) {
      resetTranscript();
      console.log("Dictating is off - transcript was reseted");
    }
  }, [isDictating]);

  // Add the autoGrow function for dynamic textarea sizing
  const autoGrow = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E4E9F2",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
          <div
            className="card w-full max-w-md bg-base-100 shadow-xl p-5"
            style={{ backgroundColor: "#E4E9F2" }}
          >
            <div className="card-body flex items-center justify-center">
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
                <h1
                  className="text-dark-blue-500"
                  style={{
                    margin: "0 auto",
                    textAlign: "center",
                    fontSize: "20px",
                    color: "#070A40",
                  }}
                >
                  <b>Voice Dictation</b>
                </h1>
                <div>
                  <button
                    onClick={handleStartListening}
                    className="btn btn-xs sm:btn-sm btn-primary"
                  >
                    Start Listening
                  </button>
                  <button
                    onClick={handleStopListening}
                    className="btn btn-xs sm:btn-sm btn-secondary"
                  >
                    Stop Listening
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={listening}
                    className="btn btn-xs sm:btn-sm btn-primary"
                  >
                    Save
                  </button>
                </div>
                <div>
                  <p>Active Keyword: {activeKeyword || "None"}</p>
                  {listening && <p>Listening...</p>}
                  {selectedTemplate && (
                    <div>
                      <h2>
                        Selected Template: {selectedTemplate.templateName}
                      </h2>
                    </div>
                  )}
                </div>
                <div>
                  <h2>Blocks for Selected Template</h2>
                  {items.map((block, index) => (
                    <div
                      key={block.blockNo}
                      style={{
                        border: "1px solid black",
                        margin: "10px",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <h3>Block : {block.title}</h3>
                      {block.type == "file" && <input type="file" disabled />}
                      {block.type == "signature" && block.image && (
                        <img src={block.image} alt="Signature" />
                      )}
                      {block.type == "title" && (
                        <textarea
                          value={block.text}
                          onChange={(e) => autoGrow(e)}
                          style={{
                            width: "100%",
                            minHeight: "60px",
                            border: "1px solid silver",
                            overflowY: "hidden",
                            resize: "none",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateToDictate;
