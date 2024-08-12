import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TemplateCreatedSuccessfully() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { template, selectedTemplateBlocks, user } = state || {};

  //const items = state?.items;
  //const user = state?.user;

  // בדיקות נוספות
  console.log("user:", user);
  console.log("Template:", template);
  console.log("selectedTemplateBlocks:", selectedTemplateBlocks);

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
      <div
        className="card w-full max-w-sm bg-base-100 shadow-xl p-5"
        style={{ backgroundColor: "#E4E9F2", textAlign: "center" }}
      >
        <div className="card-body flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mt-8" style={{ color: "#070A40" }}>
            Template successfully saved!
          </h2>
          <div
            style={{
              width: "90%",
              backgroundColor: "white",
              borderRadius: "0.5rem",
              padding: "0.3rem",
              marginTop: "1rem",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <p className="text-md" style={{ color: "#070A40" }}>
              "{template.TemplateName}" Ready to use
            </p>
          </div>
          <button
            className="btn mb-2 btn-sm"
            onClick={() => navigate("/HomePage")}
            style={{
              borderColor: "#070A40",
              color: "#070A40",
              backgroundColor: "rgba(255, 255, 255, 0)",
              width: "60%",
            }}
          >
            Return to the home
          </button>
          <button
            className="btn btn-sm"
            onClick={() =>
              navigate("/CreateSummary", {
                state: {
                  template: template, 
                  selectedTemplateBlocks:selectedTemplateBlocks,
                  user: user,
                },
              })
            }
            style={{
              backgroundColor: "#070A40",
              color: "#ffffff",
              borderColor: "#070A40",
              width: "60%",
            }}
          >
            Start transcribing
          </button>
          <div className="flex items-center justify-center mt-20 mb-10">
            <div className="w-50 h-40">
              <img
                src={import.meta.env.BASE_URL + "/createTemplate/Successfully.png"}
                alt="Success"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
