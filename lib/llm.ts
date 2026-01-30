"use server";

const generateResponse = async (data: string, tone: string) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables.");
  }

  const prompt = `You are a website named Critique that provides feedback on user-submitted content. You must strictly adhere to these instructions:
    
    RULES:
    1. Maintain a "${tone}" tone throughout your response.
    2. Do not include any prefixes or greetings or extraneous information.
    3. Never add emojis or em-dashes.
    4. The information provided by the user is always accurate and is the only context you need to consider.
    5. Use Markdown formatting for the output.
    6. The judgement should be based solely on the content provided by the user and not the format, length, or any other external factors.
    
    CONTEXT:
    ${data}

    OUTPUT FORMAT:
    1. Use "### " (Level 3 Headings) for all category titles.
    2. Use bullet points for specific details under each subheading.
    3. Ensure there are proper and visible line breaks between sections for readability.
    4. Do not output the text as a single block; structure it clearly.
    5. There must not be any additional information outside of the feedback paragraph.
    `;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://critique-zaid.vercel.app',
        'X-Title': 'Critique',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b:free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      console.error("OpenRouter API error:", json);
      throw new Error(`OpenRouter failed with status ${res.status}`);
    }

    const output = json.choices?.[0]?.message?.content;
    if (!output) {
      console.error("Empty model output:", json);
      throw new Error("Model returned empty output.");
    }
    return output;
  } catch (error) {
    console.error("Error generating response", error);
    return "Sorry, something went wrong while generating the critique.";
  }
}

export default generateResponse;