import "regenerator-runtime/runtime"; // גורם לתמיכה של פונקציות אסינכרוניות ובגינרטורס
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./SummaryPage.css";
import SummaryPreviewModal from "./SummaryPreviewModal ";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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
  const currentDate = new Date().toLocaleDateString(); // Get current date
  const logoPath = "public/login/SpokenLogoNew.png";
  const voiceGreen = "public/Summery/Voice.png";
  const voiceBlack = "public/Summery/VoiceB.png";
  const startListeningButtonStyle = isTranscribingStarted
    ? { backgroundColor: "#E4E9F2", color: "#070A40", borderColor: "#070A40" }
    : { backgroundColor: "#070A40", color: "#E4E9F2", borderColor: "#070A40" };


    console.log(selectedTemplate);
    console.log(selectedTemplateBlocks);
    
    console.log(state);
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

  console.log(user);
  const handleSaveAsPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const pageHeight = doc.internal.pageSize.height;

    // Add logo
    doc.addImage(logoPath, "PNG", 10, 10, 30, 10);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(template.templateName, 105, y, { align: "center" });
    y += 20;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    const selectedClientName = clients.find(client => client.id === parseInt(selectedClient))?.customerName || "Unknown Client";

    // Display creator, client, and description in one line
    const creatorText = `Creator: ${extractUserName(user.Email)}`;
    const clientText = `Client: ${selectedClientName}`;
    const descriptionText = `Description: ${template.description}`;

    // Calculate positions to ensure they fit in one line
    const margin = 10;
    const spacing = 70; // Adjust spacing as needed
    const creatorX = margin;
    const clientX = creatorX + spacing;
    const descriptionX = clientX + spacing;

    doc.text(creatorText, creatorX, y);
    doc.text(clientText, clientX, y);
    doc.text(descriptionText, descriptionX, y);
    y += 10; // Move to the next line

    blocks.forEach((block, index) => {
      y += 10; // Add space before each block title

      if (y + 40 > pageHeight) { // Check if there is enough space for the next block, otherwise add a new page
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`${block.title}`, 10, y);
      y += 6;

      const blockTop = y; // Start of text
      const lines = doc.splitTextToSize(block.text, 180); // Adjust the width as needed

      const blockHeight = lines.length * 6 + 6; // Calculate block height
      if (blockTop + blockHeight + 10 > pageHeight) { // Check if there is enough space for the block, otherwise add a new page
        doc.addPage();
        y = 20;
      }

      // Draw the rectangle before adding the text
      doc.rect(8, blockTop, 194, blockHeight, 'S');

      // Add the text inside the rectangle
      lines.forEach((line, i) => {
        y += 6; // Move y position down before adding the text to ensure it starts inside the rectangle
        doc.text(line, 10, y);
      });

      y += 10; // Space after each block
    });

    // Add space before the signature
    y += 20;

    if (y + 20 > pageHeight) { // Check if there is enough space for the signature and date, otherwise add a new page
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "normal");
    doc.text("Signed:", 10, y);

    if (user.Signature) {
      // Use the full data URL directly and adjust the size and position
      doc.addImage(user.Signature, "PNG", 22, y - 10, 30, 15); // Adjust the size and position as needed
    } else {
      doc.text("______________", 40, y);
    }

    y += 20; // Adjust the space after the signature
    doc.text(`Date: ${currentDate}`, 10, y);

    // Save the PDF
    const fileName = `${template.templateName}.pdf`;
    doc.save(fileName);

    // Delay opening the file
    setTimeout(() => {
      const pdfUrl = URL.createObjectURL(doc.output('blob'));
      window.open(pdfUrl);
    }, 1000); // Delay of 1 second
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

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    console.log("Stop listening...");
    setActiveKeyword(null); // איפוס מילות המפתח
    setIsDictating(false); //איפוס מצב ההכתבה
    setIsTranscribingStarted(false); // Reset the state to indicate that transcribing has stopped
  };

  useEffect(() => {
    console.log(transcript);
    if (!isDictating) {
      handleTranscriptKeywords(); // אנחנו בודקים את מילות המפתח בתמלול
    } else if (transcript.toLowerCase().trim().endsWith("stop")) {
      handleStopDictating(); //עוצרים את ההכתבה לא את ההאזנה
    } else {
      appendTranscriptToActiveBlock(); // אחרת התמלול מתווסף לבלוק שפעיל
    }
  }, [transcript]); // כל שינוי בטרנקריפט זה קורה

  const handleStopDictating = () => {
    console.log("Stop dictating - last KeyWord was ", activeKeyword);
    setIsDictating(false);
    setActiveKeyword(null);
    resetTranscript();
  };

  const appendTranscriptToActiveBlock = () => {
    console.log(`Append transcript to ${activeKeyword}`);
    if (activeKeyword && isDictating) {
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

  const handleTranscriptKeywords = () => {
    if (!listening) {
      console.log("system is not listeting");
      return;
    }

    let foundKeyword = blocks.find((item) =>
      transcript.toLowerCase().endsWith(item.keyWord.toLowerCase())
    );
    console.log("Founded keyword is : ", foundKeyword);

    if (foundKeyword && !isDictating) {
      setIsDictating(true); //מפעילה את מצב ההכתבה
      setActiveKeyword(foundKeyword.keyWord); // מעדכנת את מילת המפתח
      resetTranscript(); // איפוס התמלול כדי שלא יכתוב לתוך הבלוק מה ששמע עד כה
    }
  };

  if (!browserSupportsSpeechRecognition) {
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
          <h1 style={{ margin: "0 auto" }}>
            <b>Create Summary</b>
          </h1>
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
                  border: `1px solid ${activeKeyword && block.keyWord.toLowerCase() === activeKeyword.toLowerCase()
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
<div className="signed-date" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginLeft: '0' }}>
  <label style={{ marginRight: '10px' }}><b>Signed:</b></label>
  {user.Signature ? (
    <img src={user.Signature} alt="Signature" style={{ width: '100px', height: '40px', marginRight: '20px' }} />
  ) : (
    <span style={{ marginRight: '50px' }}> ___________ </span>
  )}
  <label style={{ marginLeft: '20px', marginRight: '10px' }}><b>Date:</b></label>
  <span>{currentDate}</span>
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
