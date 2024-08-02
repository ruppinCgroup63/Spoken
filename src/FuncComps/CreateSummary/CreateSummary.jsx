import "regenerator-runtime/runtime"; // גורם לתמיכה של פונקציות אסינכרוניות ובגינרטורס
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./SummaryPage.css";
import SummaryPreviewModal from "./SummaryPreviewModal ";
import { jsPDF } from "jspdf";
import axios from "axios";

const apiUrlClients = "https://localhost:44326/api/Customers";
const apiUrlSummaries = "https://localhost:44326/api/Summary";
const apiUrlBlocks = "https://localhost:44326/api/BlockInSummary";
const apiUrlGetBlocks = "https://localhost:44326/api/BlocksInTemplates/getBlocksByTemplateNo";

const CreateSummary = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { template, selectedTemplateBlocks, user } = state || {};
  const [selectedTemplate, setSelectedTemplate] = useState(template);
  const [blocks, setBlocks] = useState(selectedTemplateBlocks || []);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [clients, setClients] = useState([]); // מצב לשמירת שמות הלקוחות
  const [selectedClient, setSelectedClient] = useState(""); // מצב לשמירת הלקוח שנבחר
  const [isTranscribingStarted, setIsTranscribingStarted] = useState(false); // מצב הכפתור
  const [activeKeyword, setActiveKeyword] = useState(null); // מצב עבור מילת מפתח פעילה

  const voiceGreen = "public/Summery/Voice.png";
  const voiceBlack = "public/Summery/VoiceB.png";
  const startListeningButtonStyle = isTranscribingStarted
    ? { backgroundColor: "#E4E9F2", color: "#070A40", borderColor: "#070A40" }
    : { backgroundColor: "#070A40", color: "#E4E9F2", borderColor: "#070A40" };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(apiUrlClients);
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition, // בדיקה שהדפדפן תומך בתמלול
  } = useSpeechRecognition();

  const [isDictating, setIsDictating] = useState(false); // מצב כדי לעקוב אחר הכתבה ולנהל את ההכתבה לבלוקים

  useEffect(() => {
    setBlocks(selectedTemplateBlocks);
  }, [selectedTemplateBlocks]);

  const handleTextChange = (index, newText) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index].text = newText;
    setBlocks(updatedBlocks);
  };

  const handleSaveClick = () => {
    console.log("Save button clicked");
  };

  const handleSaveAsPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(18);
    doc.text("New patient admission", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Username: ${extractUserName(template.CreatorEmail)}`, 10, y);
    y += 10;

    doc.text(`Summary Name: ${template.SummaryName}`, 10, y);
    y += 10;

    doc.text(`Description: ${template.Description}`, 10, y);
    y += 10;

    blocks.forEach((block, index) => {
      doc.text(`Block ${index + 1}: ${block.title}`, 10, y);
      y += 10;
      doc.text(`Keyword: ${block.keyWord || ""}`, 10, y);
      y += 10;
      doc.text(`Text: ${block.text}`, 10, y);
      y += 10;
    });

    doc.text("Signed: ________________", 10, y);
    y += 10;
    doc.text("Date: ________________", 10, y);

    doc.save("summary.pdf");
  };



  const handleAIClick = async () => {
    try {
      const correctedBlocks = await Promise.all(
        blocks.map(async (block) => {
          const response = await fetch("http://localhost:3000/correct-text", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: block.text,
            }),
          });
          const data = await response.json();
          return { ...block, text: data.correctedText };
        })
      );
      setBlocks(correctedBlocks);
    } catch (error) {
      console.error("Error correcting text:", error);
    }
  };


  const handleDocumentProductionClick = async () => {
    if (!selectedClient) {
      alert("Please select a client before saving the document.");
      return;
    }
  
    console.log("handleCreateSummaryClick called with template:", template);
    const summary = {
      SummaryNo: Math.random().toString(36).substring(2, 9),
      SummaryName: template.templateName,
      Description: template.description,
      Comments: "",
      CreatorEmail: user.Email,
      CustomerId: parseInt(selectedClient, 10)
    };
    console.log(summary);
    console.log(selectedClient);
  
    try {
      // Create summary in server
      const summaryResponse = await fetch(apiUrlSummaries, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(summary),
      });
  
      if (!summaryResponse.ok) {
        throw new Error(`HTTP error! Status: ${summaryResponse.status}`);
      }
  
      const summaryResult = await summaryResponse.json();
      console.log("Summary created successfully", summaryResult);
  
      // Fetch blocksInTemplate
      const blocksResponse = await fetch(apiUrlGetBlocks, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedTemplate),
      });
  
      if (!blocksResponse.ok) {
        throw new Error("Failed to fetch data");
      }

  
      // Create blockInSummary in server
      const createdBlocks = [];
      
      for (const block of selectedTemplateBlocks) {
        const summaryBlock = {
          SummaryNo: summary.SummaryNo,
          BlockNo: block.blockNo,
          TemplateNo: block.templateNo,
          Text: block.text || "",
          IsApproved: false,
        };
        console.log(selectedTemplateBlocks);
        console.log(summaryBlock);
  
        const blockResponse = await fetch(apiUrlBlocks, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(summaryBlock),
        });
  
        if (!blockResponse.ok) {
          throw new Error(`HTTP error! Status: ${blockResponse.status}`);
        }
  
        //const blockResult = await blockResponse.json();
        //console.log("Block inserted successfully:", blockResult);
        //createdBlocks.push(blockResult);
        //console.log(blockResult);
      }
  
      alert("Document and blocks saved successfully!");
    } catch (error) {
      console.error("Error saving document and blocks:", error);
      alert("An error occurred while saving the document and blocks.");
    }
  };

  // Extract the username from the email
  const extractUserName = (email) => {
    if (!email) return "Unknown User";
    return email.split("@")[0];
  };
  

  //const userName = extractUserName(template.CreatorEmail);

  {/*//UseEffect עבור בדיקה האם הועברה תבנית-סיכום , ובלוקים של התבנית
  useEffect(() => {
    if (!summary || !blocks) {
      console.error("No template data found!");
      return;
    }
  }, [summary, blocks]);*/}

  //התחלה האזנה (בלבד) רציפה - ללא הכתבה
  const handleStartListening = () => {
    if (!listening) {
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US", // Use user.LangName or default to "he-IL"
      });
      console.log("Started listening...");
      setIsTranscribingStarted(true); // Set the state to indicate that transcribing has started
    } else {
      handleStopListening(); // אם כבר מאזינים, עוצרים את ההאזנה
    }
  };

  //עצירת האזנה
  //פונקציה שמטפלת בעצירת ההאזנה - עוצר תמלול והאזנה - מיקרופון מכובה
  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    console.log("Stop listening...");
    setActiveKeyword(null); // איפוס מילות המפתח
    setIsDictating(false); //איפוס מצב ההכתבה
    setIsTranscribingStarted(false); // Reset the state to indicate that transcribing has stopped
  };

  //ניהול האזנה והתמלול
  useEffect(() => {
    console.log(transcript);
    if (!isDictating) {
      //אם מצב ההכתבה לא פעיל
      handleTranscriptKeywords(); // אנחנו בודקים את מילות המפתח בתמלול
    } else if (transcript.toLowerCase().trim().endsWith("stop")) {
      //אם התמלול מסתיים בסטופ
      handleStopDictating(); //עוצרים את ההכתבה לא את ההאזנה
    } else {
      appendTranscriptToActiveBlock(); // אחרת התמלול מתווסף לבלוק שפעיל
    }
  }, [transcript]); // כל שינוי בטרנקריפט זה קורה

  //עצירת התמלול בלבד - איפוס מילת מפתח איפוס מצב הכתבה
  const handleStopDictating = () => {
    console.log("Stop dictating - last KeyWord was ", activeKeyword);
    setIsDictating(false);
    console.log("is dictating now turn from on to : ", isDictating);
    setActiveKeyword(null);
    resetTranscript();
  };

  //ההכתבה לבלוק - פונקציה לניהול ההכתבה לבלוק
  const appendTranscriptToActiveBlock = () => {
    console.log(`Append transcript to ${activeKeyword}`);
    // ישנה מילת מפתח פועלת - כלומר בלוק שאליו מתמללים - וגם מצב הכתבה פועל
    if (activeKeyword && isDictating) {
      console.log(
        "Active Key Is : ",
        activeKeyword,
        " isDictating ? : ",
        isDictating
      );

      // רק אם זוהתה מילת מפתח - ומצב הכתבה פועל נעדכן את הטקסט של הבלוק - כלומר הכתבה לבלוק
      setBlocks((prevItems) =>
        prevItems.map((item) =>
          item.keyWord.toLowerCase() === activeKeyword.toLowerCase()
            ? { ...item, text: (item.text || "") + " " + transcript }
            : item
        )
      );
      resetTranscript();
    }
  };

  //פונקציה שמנהלת את ההכתבה לתוך הקומפוננטה
  const handleTranscriptKeywords = () => {
    //תנאי מקדים - בדיקה שהמערכת מאזינה
    if (!listening) {
      console.log("system is not listeting");
      return;
    }

    console.log("Items of the template are : ", blocks);

    //חיפוש/זיהוי מילת מפתח מתוך מילות המפתח של הבלוקים
    let foundKeyword = blocks.find((item) =>
      transcript.toLowerCase().endsWith(item.keyWord.toLowerCase())
    );
    console.log("Founded keyword is : ", foundKeyword);

    //במקרה ובו זוההתה מילת מפתח - ומצב ההכתבה לא פועל - נפעיל אותו כדי לכתוב לבלוק המתאים
    if (foundKeyword && !isDictating) {
      setIsDictating(true); //מפעילה את מצב ההכתבה
      setActiveKeyword(foundKeyword.keyWord); // מעדכנת את מילת המפתח
      resetTranscript(); // איפוס התמלול כדי שלא יכתוב לתוך הבלוק מה ששמע עד כה
    }
  };

  if (!browserSupportsSpeechRecognition) {
    //בדיקה האם הדפדפן לא תומך בספיץ רגונישן
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handlePreviewClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const stopButtonStyle = listening
    ? { backgroundColor: "#070a40", color: "#ffffff" }
    : {};

    //console.log(summary);
    console.log(template);


  return (
    
    <div className="bg-light-blue-500 min-h-screen flex justify-center items-center">
      <div
        className="card w-full max-w-md bg-base-100 shadow-xl p-5"
        style={{ backgroundColor: "#E4E9F2" }}
      >
        <div className="card-body flex flex-col items-start justify-center">
          <header className="flex justify-between items-start w-full align-self-start mb-4">
            <label
              className="btn btn-circle swap swap-rotate"
              style={{
                position: "absolute",
                top: "30px",
                left: "20px",
                backgroundColor: "#E4E9F2",
                borderColor: "#E4E9F2",
              }}
              onClick={() => navigate("/HomePage")} // חזרה למסך הבית
            >
              <input type="checkbox" />
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            </label>
            <div style={{ marginTop: "5px" }}>
              <h3
                className="text-sm"
                style={{ color: "#070A40", cursor: "pointer" }}
              ></h3>
            </div>
            <label
              className="btn btn-circle swap swap-rotate self-start"
              style={{
                backgroundColor: "#E4E9F2",
                alignSelf: "start",
                borderColor: "#E4E9F2",
                marginTop: "-18px",
                marginRight: "-15px",
              }}
            >
              <input type="checkbox" />
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>
              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            </label>
          </header>

          <div
            className="flex flex-col items-center mb-4"
            style={{ marginTop: "2rem" }}
          >
            <button
              style={startListeningButtonStyle}
              className="restart-button btn btn-xs sm:btn-sm  btn-primary"
              onClick={handleStartListening}
            >
              {isTranscribingStarted ? "Restart" : "Start Transcribing"}
            </button>
            <div className="flex items-center mt-2">
              <select
                id="clientDropdown"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="select select-bordered select-xs w-full max-w-xs"
                style={{
                  color: "#070A40",
                  backgroundColor: "rgba(255, 255, 255, 0)",
                  borderColor: "#070A40",
                }}
              >
                <option value="">Select a Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.customerName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ borderColor: "#070A40" }} className="form-card">
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  marginRight: "auto",
                  fontSize: "14px",
                  color: "#070A40",
                  position: "relative",
                  top: "-3px",
                }}
              >
                <b>Name: </b> {template.templateName}
              </span>
              <span>
                <img
                  src={isTranscribingStarted ? voiceGreen : voiceBlack}
                  style={{
                    width: "20px",
                    height: "20px",
                    marginLeft: "10px",
                    marginBottom: "10px",
                  }}
                  alt="Voice Icon"
                />
              </span>
            </div>
            <div
              style={{
                borderBottom: "1px solid silver",
                width: "100%",
                marginBottom: "1rem",
              }}
            ></div>

            {blocks.map((block, index) => (
              <div
                key={index}
                className="block"
                style={{
                  border: `2px solid ${
                    activeKeyword && block.keyWord.toLowerCase() === activeKeyword.toLowerCase()
                      ? "#04D9B2"
                      : "#070A40"
                  }`, // ירוק אם התמלול פעיל לבלוק הספציפי, כחול אם לא
                  transition: "border-color 0.5s ease",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "0.5rem" }}>
                  <h3 className="block-title" style={{ marginBottom: "0.2rem" }}>{block.title}</h3>
                  <p className="block-subtitle" style={{ marginBottom: "0.2rem" }}>keyword: {block.keyWord || ""}</p>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid silver",
                    width: "100%",
                    marginBottom: "1rem",
                  }}
                ></div>
                <textarea
                  className="block-textarea"
                  placeholder="free text area..."
                  value={block.text}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  style={{ padding: "0.5rem" }}
                />
              </div>
            ))}

            <div className="signed-date">
              <label>Signed: ___________ </label>{" "}
              <label> Date: ____________</label>
            </div>
          </div>
          <button
            style={{
              backgroundColor: "white",
              color: "#070A40",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginBottom: "2rem",
            }}
            className="btn btn-xs sm:btn-sm "
            onClick={handleAIClick}
          >
            <img
              src="/public/Summery/Ai.png"
              alt="AI Icon"
              style={{ marginRight: "10px" }} // הוספת שוליים ימניים כדי להזיז שמאלה
            />
            AI-assisted drafting
          </button>
          <div className="button-group">
            <button
              className="btn btn-xs sm:btn-sm  btn-outline btn-primary"
              style={{
                color: "#070A40",
                backgroundColor: "rgba(255, 255, 255, 0)",
                borderColor: "#070A40",
              }}
              onClick={handlePreviewClick}
            >
              Preview
            </button>
            <button
              className="btn btn-xs sm:btn-sm  btn-outline btn-primary"
              style={{
                color: "#070A40",
                backgroundColor: "rgba(255, 255, 255, 0)",
                borderColor: "#070A40",
              }}
              onClick={handleSaveAsPDF}
            >
              Save as PDF
            </button>
            <button
              style={{
                backgroundColor: "#070A40",
                color: "#E4E9F2",
                borderColor: "#070A40",
              }}
              className="btn btn-xs sm:btn-sm  btn-outline btn-primary"
              onClick={handleDocumentProductionClick}
            >
              Document production
            </button>
          </div>

          <SummaryPreviewModal
            isVisible={isModalVisible}
            onClose={handleCloseModal}
            summary={template}
            blocks={blocks}
            userName={extractUserName(template?.CreatorEmail)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateSummary;