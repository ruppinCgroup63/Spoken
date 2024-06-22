import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SummaryPage.css';

const CreateSummary = () => {
  const { state } = useLocation();
  const { summary, selectedTemplateBlocks, user } = state;
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

  return (
    <div className="container">
      <div className="summary-content">
        <div className="header">
          <h1>{summary.SummaryName}</h1>
          <p>{summary.Description}</p>
          <span className="user-name">{summary.CreatorEmail}</span>
        </div>

        {blocks.map((block, index) => (
          <div key={index} className="block">
            <h5 className="block-title">Block {index + 1}</h5>
            <p className="block-subtitle">Keyword: {block.keyword || 'N/A'}</p>
            <textarea
              className="block-textarea"
              value={block.text}
              onChange={(e) => handleTextChange(index, e.target.value)}
            />
          </div>
        ))}

        <div className="button-group">
          <button onClick={handleAIClick}>AI</button>
          <button onClick={handleSaveClick}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default CreateSummary;
