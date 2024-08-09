import React from "react";

function CardSummary({
  title,
  description,
  tags,
  onCardClick,
  onPreviewClick,
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
            className="btn btn-xs sm:btn-sm btn-outline btn-primary"
            style={{
              color: "#E4E9F2",
              backgroundColor: "#070A40",
              borderColor: "#070A40",
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("Preview Summary button clicked");
              onPreviewClick();
            }}
          >
            Preview Summary
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardSummary;
