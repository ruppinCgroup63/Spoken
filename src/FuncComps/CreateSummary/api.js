import axios from "axios";
import fs from "fs";
import OpenAI from "openai";

// Replace this with your actual OpenAI API key
const apiKey = "";
const apiUrl = "https://api.openai.com/v1/chat/completions"; // Correct endpoint for chat completion
const systemPrompt =
  "You are a helpful assistant for the company ZyntriQix. Your task is to correct any spelling discrepancies in the transcribed text. Make sure that the names of the following products are spelled correctly: ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T. Only add necessary punctuation such as periods, commas, and capitalization, and use only the context provided.";
export const correctText = async (text) => {
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: "gpt-4o",
        temperature: 0,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: text,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const correctedText = response.data.choices[0].message.content;
    return correctedText.trim();
  } catch (error) {
    console.error("Error correcting text:", error);
    throw error;
  }
};
