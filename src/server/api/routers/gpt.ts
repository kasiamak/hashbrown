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
      const response = await openai.createChatCompletion({
        messages: [
          {
            role: "system",
            content: `
            As an expert in Instagram hashtags, your task is to provide 10 highly relevant and niche hashtags for a given term, no term is too challenging. Each hashtag should be optimized for Instagram's search algorithm and most likely to drive engagement and reach for the term, which is an array of objects with two properties: hashtag (a string representing the hashtag itself) and rank (a number between 1 and 5 representing the ranking of the hashtag based on your analysis). The hashtags provided should be valid Instagram hashtags written in the valid hashtag format.

            Do not include any explanations, only provide a RFC8259 compliant JSON response following this format without deviation. Do not include "Here are 10 highly relevant and niche hashtags for term:"
            ${JSON.stringify(
              [
                { hashtag: "string", rank: 0 },
                { hashtag: "string", rank: 0 },
              ],
              null,
              2
            )}
            
            
        `,
          },
          {
            role: "user",
            content: term,
          },
        ],
        model: "gpt-3.5-turbo-0613",
      });

      console.log(response);
      const { choices } = response.data;

      try {
        const hashtags: { hashtag: string; rank: number }[] = extractJson(
          choices?.[0]?.message?.content ?? ""
        );

        const foundHashtags = (
          await ctx.prisma.hashtag.findMany({
            where: { name: { in: hashtags.map(({ hashtag }) => hashtag) } },
          })
        ).map((hashtag) => hashtag.name);

        const createdHashtags = await ctx.prisma.hashtag.createMany({
          skipDuplicates: true,
          // filter out hashtags that already exist
          data: hashtags
            .filter(({ hashtag }) => !foundHashtags.includes(hashtag))
            .map(({ hashtag }) => ({ name: hashtag })),
        });

        const hashtagsToAddToSearch = (
          await ctx.prisma.hashtag.findMany({
            select: { id: true, name: true },
            where: { name: { in: hashtags.map(({ hashtag }) => hashtag) } },
          })
        ).map((hashtag) => hashtag);

        await ctx.prisma.hashtagSearch.create({
          data: {
            userId: ctx.auth.userId,
            name: term,
            hashtags: {
              createMany: {
                data: hashtagsToAddToSearch.map(({ id }) => ({
                  hashtagId: id,
                })),
              },
            },
          },
        });

        return hashtagsToAddToSearch;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: choices?.[0]?.message?.content,
        });
      }
    }),
});
