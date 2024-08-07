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
            <button
              className="btn btn-ghost btn-circle text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                onPreviewClick();
              }}
            >
              <svg
                className="w-4 h-auto fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z" />
              </svg>
            </button>
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
