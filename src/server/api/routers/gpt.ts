import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";

function extractJson(markdown: string): { hashtag: string; rank: number }[] {
  console.log(markdown);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(markdown);
}

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const gptRouter = createTRPCRouter({
  hashtags: protectedProcedure
    .input(z.object({ term: z.string() }))
    .mutation(async ({ ctx, input: { term } }) => {
      openai;
      const {
        data: { choices },
      } = await openai.createChatCompletion({
        messages: [
          {
            role: "system",
            content: `
        As an expert in Instagram hashtags, your task is to provide 10 highly relevant and niche hashtags for a given query. Each hashtag should be optimized for Instagram's search algorithm and most likely to drive engagement and reach for the topic, which is an array of objects with two properties: hashtag (a string representing the hashtag itself) and rank (a number between 1 and 5 representing the ranking of the hashtag based on your analysis). The hashtags provided should be valid Instagram hashtags written in the valid hashtag format

        you support any language 

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

      try {
        const hashtags: { hashtag: string; rank: number }[] = extractJson(
          choices?.[0]?.message?.content ?? ""
        );
        await ctx.prisma.hashtag.createMany({
          data: hashtags.map(({ hashtag }) => ({ name: hashtag })),
        });
        return hashtags;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: JSON.stringify(error),
        });
      }
    }),
});
