"use server";

export async function getCodeforcesData(username: string) {
  const res = await fetch(
    `https://codeforces.com/api/user.info?handles=${username}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Codeforces fetch failed:", res.status, text);
    throw new Error("Failed to fetch Codeforces data");
  }

  const data = await res.json();

  if (data.status !== "OK") {
    throw new Error("Invalid Codeforces username");
  }

  console.log(data);
  return data;
}
