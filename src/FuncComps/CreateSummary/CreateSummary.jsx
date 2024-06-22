import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SummaryPage.css';

const CreateSummary = () => {
  const { state } = useLocation();
  const { summary, selectedTemplateBlocks } = state;
  const [blocks, setBlocks] = useState(selectedTemplateBlocks);

  useEffect(() => {
    setBlocks(selectedTemplateBlocks);
  }, [selectedTemplateBlocks]);

  const handleTextChange = (index, newText) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index].text = newText;
    setBlocks(updatedBlocks);
  };

  const handleSaveClick = () => {
    // Implement save functionality here
    console.log('Save button clicked');
  };

  const handleAIClick = () => {
    // Implement AI functionality here
    console.log('AI button clicked');
  };

  // Extract the username from the email
  const extractUserName = (email) => {
    return email.split('@')[0];
  };

  const userName = extractUserName(summary.CreatorEmail);

  return (
    <div className="container">
      <div className="header">
        <img src="path/to/user/image.png" alt="User" />
        <h1>New patient admission</h1>
        <span>{userName}</span>
      </div>

      <button className="restart-button">Restart</button>

      <div className="form-card">
        <h2>{summary.SummaryName}</h2>
        <p>{summary.Description}</p>

        {blocks.map((block, index) => (
          <div key={index} className="block">
            <h3 className="block-title">{block.title}</h3>
            <p className="block-subtitle">keyword: {block.keyword || ''}</p>
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
        <button onClick={handleSaveClick}>Preview</button>
        <button onClick={handleSaveClick}>Save as PDF</button>
      </div>

      <button className="document-production-button">Document production</button>
    </div>
  );
};

export default CreateSummary;
