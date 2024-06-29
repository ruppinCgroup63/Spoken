import React from "react";
import "./SummaryPreviewModal.css"; // Ensure this CSS file exists for modal styles

const SummaryPreviewModal = ({
  isVisible,
  onClose,
  summary,
  blocks,
  userName,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="header">
          <img src="path/to/user/image.png" alt="UserImage" />
          <h1>New patient admission</h1>
          <span>{userName}</span>
        </div>
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
                readOnly
              />
            </div>
          ))}

          <div className="signed-date">
            <label>Signed: ________________</label>
            <label>Date: ________________</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPreviewModal;
