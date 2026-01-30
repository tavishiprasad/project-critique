"use server";

import { getCodeforcesData } from "@/lib/codeforces";
import generateResponse from "@/lib/llm";
import { Tone } from "../page";

type CodeforcesUser = {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
};

export default async function analyzeCodeforces({
  username,
  tone,
}: {
  username: string;
  tone: Tone;
}) {
  const raw = await getCodeforcesData(username);

  const user: CodeforcesUser = raw.result[0];

  if (!user) {
    throw new Error("Invalid Codeforces username");
  }

  const rating = user.rating ?? "Unrated";
  const maxRating = user.maxRating ?? "N/A";

  const data = `
Codeforces Profile Analysis

Handle: ${user.handle}
Current Rating: ${rating}
Max Rating: ${maxRating}
Current Rank: ${user.rank ?? "Unranked"}
Max Rank: ${user.maxRank ?? "N/A"}
  `.trim();

  const feedback = await generateResponse(data, tone);
  return feedback;
}
