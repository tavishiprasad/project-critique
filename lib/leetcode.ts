"use server";

export async function getLeetCodeData(username: string) {
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
      "Referer": "https://leetcode.com",
      "Origin": "https://leetcode.com",
    },
    body: JSON.stringify({
      query: `
        query getLeetCodeProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
          }
          userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
          }
        }
      `,
      variables: { username },
    }),
  });

//   console.log("LeetCode status:", res.status);


  if (!res.ok) {
    const text = await res.text();
    console.error("LeetCode fetch failed:", res.status, text);
    throw new Error("Failed to fetch LeetCode data");
  }

  const data= await res.json();
  return data;
}
