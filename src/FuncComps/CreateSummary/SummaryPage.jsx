import React from 'react';
import './SummaryPage.css';

function SummaryPage({ username, summary, blocks }) {
  return (
    <div className="summary-page">
      <div className="header">
        <img src="path/to/profile-pic.png" alt="User" className="profile-pic" />
        <span>{username}</span>
        <button className="menu-button">
          <svg width="24" height="24" fill="currentColor">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <h2 className="summary-title">{summary.title}</h2>
      <button className="restart-button">Restart</button>
      <div className="blocks-container">
        {blocks.map((block, index) => (
          <div className="block-box" key={index}>
            <label>{block.title}</label>
            <textarea placeholder="free text area..."></textarea>
          </div>
        ))}
      </div>
      <div className="footer">
        <div className="signature">
          <span>Signed: __________</span>
          <span>Date: __________</span>
        </div>
        <button className="ai-button">AI-assisted drafting</button>
        <button className="preview-button">Preview</button>
        <button className="save-button">Save as PDF</button>
        <button className="doc-prod-button">Document production</button>
      </div>
    </div>
  );
}

export default SummaryPage;
