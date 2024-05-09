import React, { useState } from "react";

function Card() {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div
          className="card bg-white shadow-xl relative p-3"
          style={{ maxWidth: "15rem", maxHeight: "15rem" }}
        >
          <div
            className="card-body flex items-center justify-between"
            style={{ padding: "0 0.1rem" }}
          >
            <div className="flex items-center">
              <h2 className="card-title text-sm">Template Name</h2>
              <button
                className={`btn btn-ghost btn-circle ${
                  isFavorite ? "text-red-500" : "text-gray-300"
                }`}
                onClick={toggleFavorite}
              >
                <svg
                  className="text-red-400 w-6 h-auto fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z" />
                </svg>
              </button>
            </div>
            <div className="mt-4 bg-white">
              <textarea
                className="textarea textarea-bordered h-24 w-full bg-white"
                placeholder="A description of the template"
              ></textarea>
            </div>
          </div>
          <div className="card-actions justify-end mt-4">
            <div className="badge badge-outline">הנדסה</div>
            <div className="badge badge-outline">בניין</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
