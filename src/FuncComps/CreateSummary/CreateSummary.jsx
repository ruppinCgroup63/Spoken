import "regenerator-runtime/runtime"; // גורם לתמיכה של פונקציות אסינכרוניות ובגינרטורס
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./SummaryPage.css";
import SummaryPreviewModal from "./SummaryPreviewModal ";
import { jsPDF } from "jspdf";
import axios from "axios";

const CreateSummary = () => {
  const { state } = useLocation();
  const { summary, selectedTemplateBlocks, user } = state;
  const [blocks, setBlocks] = useState(selectedTemplateBlocks || []);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  /*const user = sessionStorage.getItem("user");
  console.log(user);*/
  console.log(
    "Selected templates blovcks: ",
    selectedTemplateBlocks,
    "Assihn to variable blocks :",
    blocks
  );
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition, // בדיקה שהדפדפן תומך בתמלול
  } = useSpeechRecognition();

  const [activeKeyword, setActiveKeyword] = useState(null); // מצב עבור מילת מפתח פעילה
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
    doc.text(`Username: ${extractUserName(summary.CreatorEmail)}`, 10, y);
    y += 10;

    doc.text(`Summary Name: ${summary.SummaryName}`, 10, y);
    y += 10;

    doc.text(`Description: ${summary.Description}`, 10, y);
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

  //שליחה לשרת - בקשה דרך הקונטרולר
  /*const handleAIClick = async () => {
    try {
      const correctedBlocks = await Promise.all(
        blocks.map(async (block) => {
          const response = await fetch(
            "https://localhost:7224/api/TextCorrection/correct",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(block),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const correctedBlock = await response.json();
          return correctedBlock;
        })
      );
      setBlocks(correctedBlocks);
    } catch (error) {
      console.error("Error during the text correction process:", error.message);
    }
  };*/

  // Extract the username from the email
  const extractUserName = (email) => {
    return email.split("@")[0];
  };
  const handleAIClick = () => {
    console.log("AI clicked");
  };

  // בקשה ישירה דרך הפרונט - לכן התקנו AXIOS
  /* const handleAIClick = async () => {
    try {
      const correctedBlocks = await Promise.all(
        blocks.map(async (block) => {
          const correctedText = await correctText(block.text);
          return { ...block, text: correctedText };
        })
      );
      setBlocks(correctedBlocks);
    } catch (error) {
      console.error("Error correcting text:", error);
    }
  };

  const correctText = async (text) => {
    const response = await fetch(
      "https://localhost:7224/api/TextCorrection/correct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );

    const data = await response.json();
    return data.CorrectedText.trim();
  };

  /*const correctText = async (text) => {
    const response = await fetch(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          prompt: `Correct the grammar and spelling of the following text: ${text}`,
          max_tokens: 60,
          temperature: 0.7,
        }),
      }
    );*/

  /* const data = await response.json();
    return data.choices[0].text.trim();
  };*/

  const userName = extractUserName(summary.CreatorEmail);

  //UseEffect עבור בדיקה האם הועברה תבנית-סיכום , ובלוקים של התבנית
  useEffect(() => {
    if (!summary || !blocks) {
      console.error("No template data found!");
      return;
    }
  }, [summary, blocks]);

  //התחלה האזנה (בלבד) רציפה - ללא הכתבה
  const handleStartListening = () => {
    if (!listening) {
      SpeechRecognition.startListening({
        continuous: true,
        //language: user.langName || "en-US", // Use user.LangName or default to "en-US"
        language: "en-US", // Use user.LangName or default to "en-US"
      });
      console.log("Started listening...");
    } else console.log("System is already listening");
  };

  //עצירת האזנה
  //פונקציה שמטפלת בעצירת ההאזנה - עוצר תמלול והאזנה - מיקרופון מכובה
  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    console.log("Stop listening...");
    setActiveKeyword(null); // איפוס מילות המפתח
    setIsDictating(false); //איפוס מצב ההכתבה
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
        "In if \n",
        "Active Key Is : ",
        activeKeyword,
        "isDictating ? : ",
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

    //במקרה ובו זוההתה מילת מפתח - ומצב הכתבה לא פועל - נפעיל אותו כדי לכתוב לבלוק המתאים
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

  const isAnyBlockNotEmpty = blocks.some(
    (block) => block.text && block.text.trim() !== ""
  );
  console.log(isAnyBlockNotEmpty);

  const stopButtonStyle = listening
    ? { backgroundColor: "#070a40", color: "#ffffff" }
    : {};
  return (
    <div className="container">
      <div className="header">
        <img src="path/to/user/image.png" alt="UserImage" />
        <h1>New patient admission</h1>
        <span>{userName}</span>
      </div>
      <button className="restart-button" onClick={handleStartListening}>
        {isAnyBlockNotEmpty ? "Restart" : "Start Transcrinig"}
      </button>

      <div className="form-card">
        <h2>{summary.SummaryName}</h2>
        <p>{summary.Description}</p>

        {blocks.map((block, index) => (
          <div key={index} className="block">
            <h3 className="block-title">{block.title}</h3>
            <p className="block-subtitle">keyword: {block.keyWord || ""}</p>
            <textarea
              className="block-textarea"
              placeholder="free text area..."
              value={block.text}
              onChange={(e) => handleTextChange(index, e.target.value)}
            />
          </div>
        ))}

        <div className="signed-date">
          <label>Signed: ________________</label>
          <label>Date: ________________</label>
        </div>
      </div>

      <button className="ai-button" onClick={handleAIClick}>
        <img src="path/to/ai-icon.png" alt="AI" />
        AI-assisted drafting
      </button>

      <div className="button-group">
        <button onClick={handlePreviewClick}>Preview</button>
        <button onClick={handleSaveAsPDF}>Save as PDF</button>
        <button
          onClick={handleStopListening}
          disabled={!listening}
          style={stopButtonStyle}
        >
          Stop Listeting
        </button>
      </div>

      <button className="document-production-button">
        Document production
      </button>

      <SummaryPreviewModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        summary={summary}
        blocks={blocks}
        userName={userName}
      />
    </div>
  );
};

export default CreateSummary;
