import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const apiUrlSummaryBySummaryNo = "https://localhost:44326/api/Summary/getBySummaryNo";
const apiUrlBlocksInSummary = "https://localhost:44326/api/BlockInSummary/getBlocksBySummaryNo";

function CreateSummary() {
  const location = useLocation();
  const { summary, selectedTemplateBlocks } = location.state || {}; // ודא שקבלת הנתונים בוצעה כראוי

  const [summaryData, setSummaryData] = useState(summary || {});
  const [blocksData, setBlocksData] = useState(selectedTemplateBlocks || []);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        console.log("Fetching summary for summary number:", summary.SummaryNo);
        console.log("Fetching summary :", summary);
        console.log("Fetching block:", selectedTemplateBlocks);

        // Fetch summary data if not passed in location state
        if (!summary) {
          const responseSummary = await fetch(apiUrlSummaryBySummaryNo, {
            method: "GET",
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(summary.SummaryNo),
            
          });
          if (!responseSummary.ok) {
            throw new Error("Failed to fetch summary data");
          }

          const summaryResult = await responseSummary.json();
          setSummaryData(summaryResult);
        }

        // Fetch blocks data
        const responseBlocks = await fetch(apiUrlBlocksInSummary, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({ summaryNo: summary.SummaryNo }),
        });

        if (!responseBlocks.ok) {
          throw new Error("Failed to fetch blocks data");
        }

        const blocksResult = await responseBlocks.json();
        setBlocksData(blocksResult);

       
      } catch (error) {
        console.error("Error fetching data:", error);

      }
    };

    if (summary) {
      fetchSummaryData();
    } else {
      setLoading(false);
      setError("No summary data available.");
    }
  }, [summary]);


  return (
    <div className="container">
      <h1>Summary: {summaryData.SummaryName}</h1>
      <p>Description: {summaryData.Description}</p>
      <p>Comments: {summaryData.comments}</p>

      <h2>Blocks</h2>
      <ul>
        {blocksData.map((block) => (
          <li key={block.blockNo}>
            <p>Block No: {block.blockNo}</p>
            <p>Text: {block.text}</p>
            <p>Approved: {block.isApproved ? "Yes" : "No"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateSummary;
