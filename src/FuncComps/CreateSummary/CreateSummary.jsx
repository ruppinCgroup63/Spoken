import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const apiUrlCreateSummary = "https://localhost:44326/api/Summary";
const apiUrlBlocks = "https://localhost:44326/api/BlocksInTemplates/getBlocksByTemplateNo";
const apiUrlCreateBlocksInSummary = "https://localhost:44326/api/BlockInSummary";

const CreateSummary = ({ template, user, setError, setSelectedTemplateBlocks }) => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(template);

  const handleCreateSummaryClick = async () => {
    debugger;
    console.log("handleCreateSummaryClick called with template:", template);
    const summary = {
      SummaryNo: Math.random().toString(36).substring(2, 9),
      SummaryName: template.templateName,
      Description: template.description,
      comments: "",
      CreatorEmail: user.Email,
    };
    console.log(summary);

    try {
      // Create summary in server
      const summaryResponse = await fetch(apiUrlCreateSummary, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(summary),
      });

      if (!summaryResponse.ok) {
        throw new Error(`HTTP error! Status: ${summaryResponse.status}`);
      }

      const summaryResult = await summaryResponse.json();
      console.log("Summary created successfully", summaryResult);

      // Fetch blocksInTemplate
      const blocksResponse = await fetch(apiUrlBlocks, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedTemplate),
      });

      if (!blocksResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const selectedTemplateBlocks = await blocksResponse.json();
      setSelectedTemplateBlocks(selectedTemplateBlocks);
      console.log(selectedTemplateBlocks);

      // Create blockInSummary in server
      const createdBlocks = [];

      for (const block of selectedTemplateBlocks) {
        const summaryBlock = {
          SummaryNo: summaryResult.SummaryNo,
          blockNo: block.blockNo,
          templateNo: block.templateNo,
          text: block.text || "",
          isApproved: false,
        };
        console.log(selectedTemplateBlocks);

        const blockResponse = await fetch(apiUrlCreateBlocksInSummary, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(summaryBlock),
        });

        if (!blockResponse.ok) {
          throw new Error(`HTTP error! Status: ${blockResponse.status}`);
        }

        const blockResult = await blockResponse.json();
        console.log("Block inserted successfully:", blockResult);
        createdBlocks.push(blockResult);
        console.log(blockResult);
      }
      

      navigate("/SummaryPage", {
        state: {user: user, summary: summary, blocks: selectedTemplateBlocks },
      });
    } catch (error) {
      console.error("Error during the POST process:", error.message);
      setError("Failed to create summary. Please try again.");
    }
  };

  return (
    <button
      className="btn btn-primary mt-4"
      onClick={(e) => {
        e.stopPropagation();
        handleCreateSummaryClick();
      }}
    >
      Create Summary
    </button>
  );
};

export default CreateSummary;
