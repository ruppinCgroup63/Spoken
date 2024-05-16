import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useLocation, useNavigate } from "react-router-dom";

import "regenerator-runtime/runtime";

function Main({ selectedTemplate, selectedTemplateBlocks }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [activeKeyword, setActiveKeyword] = useState(null);
  const [isOn, setIsOn] = useState(false);
  const [items, setItems] = useState(selectedTemplateBlocks || []);
  const handleStartListening = () => {
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
      console.log("Started listening...");
    }
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setActiveKeyword(null);
  };

  useEffect(() => {
    if (transcript.toLowerCase().trim().endsWith("stop")) {
      handleStopCommand();
    } else {
      handleTranscriptKeywords();
    }
  }, [transcript]);

  const handleStopCommand = () => {
    setIsOn(false);
    setActiveKeyword(null);
    resetTranscript();
  };

  const handleTranscriptKeywords = () => {
    if (!listening) return;

    let foundKeyword = items.find((item) =>
      transcript.toLowerCase().includes(item.KeyWord.toLowerCase())
    );

    if (foundKeyword && !isOn) {
      setIsOn(true);
      setActiveKeyword(foundKeyword.KeyWord);
    }

    if (activeKeyword && isOn) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.KeyWord === activeKeyword
            ? { ...item, Text: (item.Text || "") + " " + transcript }
            : item
        )
      );
      resetTranscript();
    }
  };

  useEffect(() => {
    if (!isOn) {
      resetTranscript();
    }
  }, [isOn]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <h1>Main Component</h1>
      <button onClick={handleStartListening}>Start Listening</button>
      <button onClick={handleStopListening}>Stop Listening</button>
      <div>
        <p>Active Keyword: {activeKeyword || "None"}</p>
        {listening && <p>Dictation is ON</p>}
        {selectedTemplate && (
          <div>
            {/* Display selected template information if needed */}
            <h2>Selected Template: {selectedTemplate.templateName}</h2>
          </div>
        )}
      </div>
      <div>
        <h2>Blocks of {selectedTemplate.templateName}</h2>
        {items.map((block, index) => (
          <div key={block.blockNo}>
            <h2>Block {index + 1}</h2>
            {block.type === "file" && <input type="file" />}
            {block.type === "signature" && (
              <div>
                <img src={block.image} alt="Signature" />
                {/* Add styling or additional elements for signature block */}
              </div>
            )}
            {block.type !== "file" && block.type !== "signature" && (
              <div>
                <h3>{block.title}</h3>
                <p>{block.text}</p>
                {/* Render text block contents */}
              </div>
            )}
            {/* Add more conditions for other block types */}
          </div>
        ))}

        {/* Your voice dictation interface JSX */}
      </div>
    </div>
  );
}

export default Main;
/* <h2>Blocks for Selected Template</h2>
          <ul>
            {selectedTemplateBlocks.map((block) => (
              <li
                key={block.blockNo}
                style={{ border: "1px solid black", margin: "10px" }}
              >
                <p>
                  <strong>Type:</strong> {block.type}
                </p>
                <p>
                  <strong>Title:</strong> {block.title}
                </p>
                <p>
                  <strong>Text:</strong> {block.text}
                </p>
                <p>
                  <strong>KeyWord:</strong> {block.keyWord}
                </p>
                <p>
                  <strong>Is Active:</strong> {block.isActive ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Is Mandatory:</strong>{" "}
                  {block.isMandatory ? "Yes" : "No"}
                </p>
              </li>
            ))}
          </ul>*/
