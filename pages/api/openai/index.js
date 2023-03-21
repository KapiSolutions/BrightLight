export const config = {
  runtime: "edge",
};

export default async function openAi(req) {
  if (req.method === "POST") {
    const { secret, data } = await req.json();

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

    // If everything Ok then make request
    try {
      const payload = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        temperature: 0.5,
      };
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
      });

      const answer = await res.json();
      return new Response(answer?.choices[0]?.message?.content || "", {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    } catch (e) {
      console.log(e);
      return new Response(e, { status: 500, headers: { "content-type": "application/json" } });
    }
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
