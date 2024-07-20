import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import { Navigate } from "react-router-dom";

dotenv.config();
 
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/correct-text", async (req, res) => {
  const { text } = req.body;
  const systemPrompt =
    "You are a helpful assistant for the company ZyntriQix. Your task is to correct any spelling discrepancies in the transcribed text. Make sure that the names of the following products are spelled correctly: ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T. Only add necessary punctuation such as periods, commas, and capitalization, and use only the context provided.";

  if (!openai.apiKey) {
    return res.status(500).send("OpenAI API key is missing");
  }

  try {
    const completion = await openai.chat.completions.create({
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
    });
    const correctedText = completion.choices[0].message.content.trim();
    res.json({ correctedText });
  } catch (error) {
    console.error("Error correcting text:", error);
    res.status(500).send("Error correcting text");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
