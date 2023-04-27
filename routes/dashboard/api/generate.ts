import { OpenAI } from "https://deno.land/x/openai/mod.ts";
import type { Handlers } from "$fresh/server.ts";
import { createManyHashtag } from "../../../utils/hashtags.ts";

const openai = new OpenAI(Deno.env.get("OPENAI_API_KEY") ?? "");

function extractJson(markdown: string) {
  console.log(markdown);
  return JSON.parse(markdown);
}

export const handler: Handlers<null, DashboardState> = {
  async POST(request, ctx) {
    try {
      const { term } = await request.json();
      console.log("term", term);
      const { choices } = await openai.createChatCompletion({
        messages: [
          {
            role: "system",
            content: `
			  As an expert in Instagram hashtags, your task is to provide 10 highly relevant and niche hashtags for a given topic. Each hashtag should be optimized for Instagram's search algorithm and most likely to drive engagement and reach for the topic, which is an array of objects with two properties: hashtag (a string representing the hashtag itself) and rank (a number between 1 and 5 representing the ranking of the hashtag based on your analysis). The hashtags provided should be valid Instagram hashtags written in the valid hashtag format

			  put your hashtags in the following format, do not include any explanations, only provide a  RFC8259 compliant JSON response  following this format without deviation
			  [
				{"hashtag": "..", "rank": 0},
				{"hashtag": "..", "rank": 0}
			  ]
			  `,
          },
          {
            role: "user",
            content: term,
          },
        ],
        model: "gpt-3.5-turbo-0301",
      });

      const hashtags: { hashtag: string; rank: number }[] = extractJson(
        choices[0].message.content,
      );
      await createManyHashtag(
        ctx.state.supabaseClient,
        hashtags.map((hashtag) => ({
          name: hashtag.hashtag,
        })),
      );

      return new Response(
        JSON.stringify(extractJson(choices[0].message.content)),
        {
          status: 200,
        },
      );
    } catch (error) {
      console.error(error);
      const status = 400;

      return new Response(error.message, { status });
    }
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
