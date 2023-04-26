import { OpenAI } from "https://deno.land/x/openai/mod.ts";
import type { Handlers } from "$fresh/server.ts";

const openai = new OpenAI(Deno.env.get("OPENAI_API_KEY") ?? "");

function extractJsonFromMarkdown(markdown: string) {
  console.log("markdown", markdown);
  const match = markdown.match(/```json\s*\n([\s\S]*?)\n```/);

  if (!match) {
    throw new Error("No JSON code block found in Markdown file");
  }

  const jsonStr = match[1];
  console.log("jsonStr", jsonStr);
  return JSON.parse(jsonStr);
}

export const handler: Handlers = {
  async GET() {
    const { choices, ...rest } = await openai.createChatCompletion({
      messages: [{
        role: "system",
        content:
          `As an expert in Instagram hashtags, your task is to provide a JSON array of 30 highly relevant and niche hashtags for a given topic. Each hashtag should be optimized for Instagram's search algorithm and most likely to drive engagement and reach for the topic. The JSON array should be returned in the form of a json, which is an array of objects with two properties: hashtag (a string representing the hashtag itself) and rank (a number between 1 and 5 representing the ranking of the hashtag based on your analysis). The hashtags provided should be valid Instagram hashtags written in the valid hashtag format.`,
      }, {
        role: "user",
        content: "fitness",
      }],
      model: "gpt-3.5-turbo-0301",
    });

    console.log(rest);

    return new Response(
      JSON.stringify(extractJsonFromMarkdown(choices[0].message.content)),
      {
        status: 200,
      },
    );
  },
};

// function generatePrompt(animal) {
//   const capitalizedAnimal = animal[0].toUpperCase() +
//     animal.slice(1).toLowerCase();
//   return `Suggest three names for an animal that is a superhero.

// Animal: Cat
// Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
// Animal: Dog
// Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
// Animal: ${capitalizedAnimal}
// Names:`;
// }
