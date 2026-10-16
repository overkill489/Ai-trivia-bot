import express from "express";
import { MODEL, ai } from "../gemini.js";

const router = express.Router();

const PROMPT = `You are a sharp, witty trivia host writing questions for a fast paced game played by adults - fun, not academic.
Given a topic write one multiple choice trivia question with four options and exactly one correct answer, plus a one-line fun fact about the correct answer. The question should be clear and concise, and the options should be plausible but only one should be correct.
Keep the question to a single sentence make the three wrong options as plausible as possible. The correct answer should be the most accurate and relevant to the question. Avoid using "all of the above" or "none of the above" as options.
Avoid trivia so obscure that only experts would know the answer, but also avoid trivia so easy that everyone would know the answer. The question should be challenging but fair.
Reply as JSON with this exact shape and nothing else:
{ "question": string, "options": [string, string, string, string], "answer": string, "funFact": string }
The "answer" must be exactly one of the four options. No preamble, no markdown.

Example - 
Topic: Space
{ "question": "Which Planet has the most moons?", "options": ["Earth", "Saturn", "Mars", "Venus"], "answer": "Saturn", "funFact": "Saturn's rings are made mostly of ice and rocky debris." }
`;

router.post("/", async (req, res) => {
  const { topic } = req.body;

  const interaction = await ai.interactions.create({
    model: MODEL,
    input: `Topic: ${topic}`,
    system_instruction: PROMPT,
    generation_config: { temperature: 0.9 },
  });

  console.log(interaction.output_text);

  const quiz = JSON.parse(interaction.output_text);
  res.json(quiz);
});

export default router;
