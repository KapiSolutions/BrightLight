import { OpenAIStream } from "../../../utils/openAiStreamPayload";

export const config = {
  runtime: "edge",
};

export default async function openAi(req) {
  if (req.method === "POST") {
    const { secret, idToken, data } = await req.json();

    // Check secret key
    if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
      return new Response(
        JSON.stringify({
          error: { message: "UNAUTHORIZED REQUEST!" },
        }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    // Verify data
    const question = data || "";
    if (question.trim().length === 0 || question.trim().length > 500) {
      return new Response(
        JSON.stringify({
          error: { message: "Please enter a valid question (max 500 characters)" },
        }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    const payload = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }],
      temperature: 0.5,
    };

    const stream = await OpenAIStream(payload);
    return new Response(stream);
  } else {
    return new Response(
      JSON.stringify({
        error: {
          message: "Method Not Allowed",
        },
      }),
      {
        status: 405,
        headers: {
          "content-type": "application/json",
          Allow: "POST",
        },
      }
    );
  }
}
