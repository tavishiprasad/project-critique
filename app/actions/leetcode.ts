"use server";

import { getLeetCodeData } from "@/lib/leetcode";
import generateResponse from "@/lib/llm";
import { Tone } from "../page";

type LeetCodeStat = {
  difficulty: string;
  count: number;
  submissions: number;
};

export default async function analyzeLeetCode({
  username,
  tone,
}: {
  username: string;
  tone: Tone;
}) {
  const raw = await getLeetCodeData(username);

  const matchedUser = raw?.data?.matchedUser;
  if (!matchedUser) {
    throw new Error("Invalid LeetCode username");
  }

  const stats: LeetCodeStat[] =
    matchedUser.submitStats?.acSubmissionNum;

  if (!stats || stats.length === 0) {
    throw new Error("No submission data found");
  }

  const rating: number | "Unrated" =
    raw?.data?.userContestRanking?.rating ?? "Unrated";

  const data = `
LeetCode Profile Analysis

Contest Rating: ${rating}

Problem Solving Stats:
${stats.map((s) => `- ${s.difficulty}: ${s.count} solved`).join("\n")}
  `.trim();

  const feedback = await generateResponse(data, tone);
  return feedback;
}
