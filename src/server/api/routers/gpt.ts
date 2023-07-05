import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";

function extractJson(markdown: string): { hashtag: string }[] {
  console.log("extractJson", markdown);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const result = JSON.parse(markdown).hashtags;
  console.log("result", result);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result;
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
            You are a expert in hashtags, based on a search term you provide 10 hashtags always which are highly relevant and niche hashtags for a given term.
            Each hashtag should be optimized for Instagram's search algorithm and most likely to drive engagement and reach for the term, Hashtags returned should be valid hashtags.
        `,
          },
          {
            role: "user",
            content: term,
          },
        ],
        functions: [
          {
            name: "get_hashtags",
            description: "Get relevant hashtags for a given term",
            parameters: {
              type: "object",
              properties: {
                hashtags: {
                  type: "array",
                  minItems: 10,
                  maxItems: 10,
                  items: {
                    type: "object",
                    properties: {
                      hashtag: { type: "string" },
                    },
                  },
                },
              },
              required: ["hashtags"],
            },
          },
        ],
        model: "gpt-3.5-turbo-0613",
      });

      console.log(response);
      const { choices } = response.data;

      try {
        console.log(
          "function_call",
          choices[0]?.message?.function_call?.arguments
        );

        const hashtags: { hashtag: string }[] = extractJson(
          choices[0]?.message?.function_call?.arguments ?? ""
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
        console.log({
          hashtagsFromGpt: hashtags,
          foundHashtags,
          createdHashtags,
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
