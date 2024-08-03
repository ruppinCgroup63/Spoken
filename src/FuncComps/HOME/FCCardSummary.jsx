import React from "react";

function CardSummary({
  title,
  description,
  tags,
  onCardClick,
  onCreateSummaryClick
}) {
  return (
    <div className="col-md-6 mb-4" onClick={onCardClick}>
      <div
        className="card bg-white shadow-xl relative p-3"
        style={{ maxWidth: "15rem", maxHeight: "15rem" }}
      >
        <div className="card-body" style={{ padding: "0 0.1rem" }}>
          <div className="flex justify-between items-center">
            <h2 className="card-title text-sm" style={{ color: "#070A40" }}>
              {title}
            </h2>
          </div>
          <hr className="mb-2" />
          <p className="text-sm">{description}</p>
          <div className="card-actions justify-end mt-4">
            {tags.map((tag, index) => (
              <div key={index} className="badge badge-outline">
                {tag}
              </div>
            ))}
          </div>
          <button
            className="btn btn-primary mt-4"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Create Summary button clicked"); // Add this line
              onCreateSummaryClick();
            }}
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardSummary;
