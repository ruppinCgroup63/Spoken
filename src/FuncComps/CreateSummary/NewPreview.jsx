import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
//import "./SummaryPage.css";

//const apiUrlBlocks = "https://localhost:44326/api/BlockInSummary/getBlocksBySummaryNo";
//const apiUrlBlocks =
  //"https://localhost:7224/api/BlockInSummary/getBlocksBySummaryNo";

  const apiUrlBlocks =
  "  https://proj.ruppin.ac.il/cgroup63/test2/tar1/api/BlockInSummary/getBlocksBySummaryNo";


const NewPreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, summary } = state || {};
  //const [addBlockList, setAddBlockList] = useState([]);
  const [error, setError] = useState("");
  const currentDate = new Date().toLocaleDateString(); // Get current date

  console.log(summary);
  console.log(state.summary);

  /*useEffect(() => {
    debugger;
    if (summary && summary.summary) {
      fetchBlocks(summary.summary.summaryNo);
    }
  }, [summary]);*/

  /* const fetchBlocks = async (summaryNo) => {
    try {
      console.log("Fetching blocks for summaryNo:", summaryNo); // Debug log
      const response = await fetch(apiUrlBlocks, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(summaryNo), // Send only summaryNo as string
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from API:", errorText); // Debug log
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("Fetched blocks data:", data); // Debug log
      //setAddBlockList(data);
    } catch (error) {
      console.error("Error fetching blocks data:", error);
      setError("Failed to fetch blocks data. Please try again.");
    }
  };

  if (!summary || !user) {
    return <div>No summary or user data found.</div>;
  }*/

  return (
    <div className="bg-light-blue-500 min-h-screen flex justify-center items-center">
      <div
        className="card w-full max-w-md bg-base-100 shadow-xl p-5"
        style={{ backgroundColor: "#E4E9F2" }}
      >
        <div className="card-body flex flex-col items-start justify-center">
          <header className="flex justify-between items-start w-full align-self-start mb-4">
            <label
              className="btn btn-circle swap swap-rotate"
              style={{
                position: "absolute",
                top: "30px",
                left: "20px",
                backgroundColor: "#E4E9F2",
                borderColor: "#E4E9F2",
              }}
              onClick={() => navigate("/AllSummery")} // Back to previous page
            >
              <input type="checkbox" />
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"></polygon>
              </svg>
              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"></polygon>
              </svg>
            </label>
          </header>

          <div className="header">
            <h1>{summary.summary.SummaryName}</h1>
            <h3>{summary.summary.Description}</h3>
          </div>

          <div style={{ borderColor: "#070A40" }} className="form-card">
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  marginRight: "auto",
                  fontSize: "14px",
                  color: "#070A40",
                  position: "relative",
                  top: "-3px",
                }}
              >
                <b>Name: </b> {summary.summary.SummaryName}
              </span>
            </div>
            <div
              style={{
                borderBottom: "1px solid silver",
                width: "100%",
                marginBottom: "1rem",
              }}
            ></div>

            {summary.addBlockList.map((block, index) => (
              <div
                key={index}
                className="block"
                style={{
                  border: `2px solid #070A40`,
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "0.5rem",
                  }}
                >
                  <h3
                    className="block-title"
                    style={{ marginBottom: "0.2rem" }}
                  >
                    {block.title}
                  </h3>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid silver",
                    width: "100%",
                    marginBottom: "1rem",
                  }}
                ></div>
                <textarea
                  className="block-textarea"
                  placeholder="free text area..."
                  value={block.Text}
                  readOnly
                  style={{ padding: "0.5rem" }}
                />
              </div>
            ))}
            <div
              className="signed-date"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginLeft: "0",
              }}
            >
              <label style={{ marginRight: "10px" }}>
                <b>Signed:</b>
              </label>
              {user.signature ? (
                <img
                  src={user.signature}
                  alt="Signature"
                  style={{
                    width: "100px",
                    height: "40px",
                    marginRight: "20px",
                  }}
                />
              ) : (
                <span style={{ marginRight: "50px" }}> ___________ </span>
              )}
              <label style={{ marginLeft: "20px", marginRight: "10px" }}>
                <b>Date:</b>
              </label>
              <span>{currentDate}</span>
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default NewPreview;
