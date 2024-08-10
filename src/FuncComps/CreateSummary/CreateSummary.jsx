import "regenerator-runtime/runtime"; // גורם לתמיכה של פונקציות אסינכרוניות ובגינרטורס
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
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
  const [selectedTemplate] = useState(template);
  const [blocks, setBlocks] = useState(selectedTemplateBlocks || []);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [clients, setClients] = useState([]); // מצב לשמירת שמות הלקוחות
  const [selectedClient, setSelectedClient] = useState(""); // מצב לשמירת הלקוח שנבחר
  const [isTranscribingStarted, setIsTranscribingStarted] = useState(false); // מצב הכפתור
  const [activeKeyword, setActiveKeyword] = useState(null); // מצב עבור מילת מפתח פעילה
  const [isDictating, setIsDictating] = useState(false); // מצב כדי לעקוב אחר הכתבה ולנהל את ההכתבה לבלוקים
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState("");
  const currentDate = new Date().toLocaleDateString(); // Get current date
  const logoPath = "public/login/SpokenLogoNew.png";
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

  useEffect(() => {
    setBlocks(selectedTemplateBlocks);
  }, [selectedTemplateBlocks]);

  const handleTextChange = (index, newText) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index].text = newText;
    setBlocks(updatedBlocks);
  };

  const handleSaveAsPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const pageHeight = doc.internal.pageSize.height;

    doc.addImage(logoPath, "PNG", 10, 10, 30, 10);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(template.templateName, 105, y, { align: "center" });
    y += 20;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    const selectedClientName =
      clients.find((client) => client.id === parseInt(selectedClient))
        ?.customerName || "Unknown Client";

    const creatorText = `Creator: ${extractUserName(user.Email)}`;
    const clientText = `Client: ${selectedClientName}`;
    const descriptionText = `Description: ${template.description}`;

    const margin = 10;
    const spacing = 70;
    const creatorX = margin;
    const clientX = creatorX + spacing;
    const descriptionX = clientX + spacing;

    doc.text(creatorText, creatorX, y);
    doc.text(clientText, clientX, y);
    doc.text(descriptionText, descriptionX, y);
    y += 10;

    blocks.forEach((block, index) => {
      y += 10;

      if (y + 40 > pageHeight) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`${block.title}`, 10, y);
      y += 6;

      const blockTop = y;
      const lines = doc.splitTextToSize(block.text, 180);

      const blockHeight = lines.length * 6 + 6;
      if (blockTop + blockHeight + 10 > pageHeight) {
        doc.addPage();
        y = 20;
      }

      doc.rect(8, blockTop, 194, blockHeight, "S");

      lines.forEach((line) => {
        y += 6;
        doc.text(line, 10, y);
      });

      y += 10;
    });

    y += 20;

    if (y + 20 > pageHeight) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "normal");
    doc.text("Signed:", 10, y);

    if (user.Signature) {
      doc.addImage(user.Signature, "PNG", 22, y - 10, 30, 15);
    } else {
      doc.text("______________", 40, y);
    }

    y += 20;
    doc.text(`Date: ${currentDate}`, 10, y);

    const fileName = `${template.templateName}.pdf`;
    doc.save(fileName);

    setTimeout(() => {
      const pdfUrl = URL.createObjectURL(doc.output("blob"));
      window.open(pdfUrl);
    }, 1000);
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

    const summary = {
      SummaryNo: Math.random().toString(36).substring(2, 9),
      SummaryName: template.templateName,
      Description: template.description,
      Comments: "",
      CreatorEmail: user.Email,
      CustomerId: parseInt(selectedClient, 10),
    };

    try {
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

      for (const block of blocks) {
        const summaryBlock = {
          SummaryNo: summary.SummaryNo,
          BlockNo: block.blockNo,
          TemplateNo: block.templateNo,
          Text: block.text,
          IsApproved: false,
        };

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

      navigate("/SummarySuccess", {
        state: { user , summary},
      });
    } catch (error) {
      console.error("Error saving document and blocks:", error);
      alert("An error occurred while saving the document and blocks.");
    }
  };

  const extractUserName = (email) => {
    if (!email) return "Unknown User";
    return email.split("@")[0];
  };

  const handleStartListening = () => {
    if (!listening) {
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
      setIsTranscribingStarted(true);
    } else {
      handleStopListening();
    }
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setActiveKeyword(null);
    setIsDictating(false);
    setIsTranscribingStarted(false);
  };

  const transcripting = useCallback(() => {
    if (!isDictating) {
      handleTranscriptKeywords();
    } else if (transcript.toLowerCase().trim().endsWith("stop")) {
      handleStopDictating();
    } else {
      appendTranscriptToActiveBlock();
    }
  }, [transcript, isDictating]);

  useEffect(() => {
    transcripting();
  }, [transcripting]);

  const handleStopDictating = useCallback(() => {
    setIsDictating(false);
    setActiveKeyword(null);
    resetTranscript();
  }, [setIsDictating, setActiveKeyword, resetTranscript]);

  const appendTranscriptToActiveBlock = useCallback(() => {
    if (activeKeyword && isDictating) {
      if (transcript !== lastProcessedTranscript) {
        const newText = transcript.replace(lastProcessedTranscript, "").trim();
        setBlocks((prevItems) =>
          prevItems.map((item) =>
            item.keyWord.toLowerCase() === activeKeyword.toLowerCase()
              ? { ...item, text: (item.text || "") + " " + newText }
              : item
          )
        );
        setLastProcessedTranscript(transcript);
      }
    }
  }, [activeKeyword, isDictating, transcript, lastProcessedTranscript]);

  const handleTranscriptKeywords = useCallback(() => {
    if (!listening) {
      return;
    }

    let foundKeyword = blocks.find((item) =>
      transcript.toLowerCase().endsWith(item.keyWord.toLowerCase())
    );

    if (foundKeyword && !isDictating) {
      setIsDictating(true);
      setActiveKeyword(foundKeyword.keyWord);
      resetTranscript();
    }
  }, [
    transcript,
    setIsDictating,
    setActiveKeyword,
    resetTranscript,
    isDictating,
    listening,
    blocks,
  ]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

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
              onClick={() => navigate("/HomePage")}
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
              <h3 className="text-sm" style={{ color: "#070A40", cursor: "pointer" }}></h3>
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
          <div className="flex flex-col items-center mb-4" style={{ marginTop: "2rem" }}>
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
                  border: `1px solid ${
                    activeKeyword &&
                    block.keyWord.toLowerCase() === activeKeyword.toLowerCase()
                      ? "#04D9B2"
                      : "#070A40"
                  }`,
                  transition: "border-color 0.5s ease",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "0.5rem",
                  }}
                >
                  <h3 className="block-title" style={{ marginBottom: "0.2rem" }}>
                    {block.title}
                  </h3>
                  <p className="block-subtitle" style={{ marginBottom: "0.2rem" }}>
                    keyword: {block.keyWord || ""}
                  </p>
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
            <div
              className="signed-date"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginLeft: "0",
              }}
            >
              <label style={{ marginRight: "10px" }}>
                <b>Signed:</b>
              </label>
              {user.Signature ? (
                <img
                  src={user.Signature}
                  alt="Signature"
                  style={{
                    width: "100px",
                    height: "40px",
                    marginRight: "20px",
                  }}
                />
              ) : (
                <span style={{ marginRight: "50px" }}> ___________ </span>
              )}
              <label style={{ marginLeft: "20px", marginRight: "10px" }}>
                <b>Date:</b>
              </label>
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
              onClick={handleSaveAsPDF}
            >
              Save As PDF
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
              Document Production
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
