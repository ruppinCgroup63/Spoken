import React from 'react'
import { useLocation, useNavigate } from "react-router-dom";

export default function TemplateCreatedSuccessfully() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const template = state?.template || {};
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-light-blue-500">
        <div
          className="card w-full max-w-md bg-base-100 shadow-xl p-5"
          style={{ backgroundColor: "#E4E9F2", textAlign: "center" }}
        >
          <div className="card-body flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold" style={{ color: "#070A40" }}>
              Template successfully saved!
            </h2>
            <p className="text-md my-4" style={{ color: "#070A40" }}>
              "{template.TemplateName}" Ready to use
            </p>
            <button
              className="btn btn-outline btn-primary mb-4"
              onClick={() => navigate("/HomePage")}
              style={{ marginBottom: "1rem" }}
            >
              Return to the home
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/StartTranscribing", { state: { template } })}
              style={{ backgroundColor: "#070A40", color: "#ffffff" }}
            >
              Start transcribing
            </button>
            <div className="mt-10 mt-4 flex items-center justify-center">
              <div className="w-45 h-40">
                <img
                  src="/public/createTemplate/Successfully.png"
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
