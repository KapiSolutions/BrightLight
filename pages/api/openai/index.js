const { Configuration, OpenAIApi } = require("openai");
import { auth, db } from "../../../config/firebaseAdmin";
import { csrf } from "../../../config/csrf";
import verifyRequest from "../../../utils/verifyRequest";
// https://platform.openai.com/docs/api-reference/chat/create?lang=node.js

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function openAi(req, res) {
  if (req.method === "POST") {
    const { secret, idToken, data } = req.body;

    // Verify data
    const question = data || "";
    if (question.trim().length === 0 || question.trim().length > 500) {
      res.status(400).json({
        error: {
          message: "Please enter a valid question (max 500 characters)",
        },
      });
      return;
    }
    const adminRoleCheck = async (uid) => {
        const response = await db.collection("users").doc(uid).get();
        const doc = response.data();
        if (doc.role == process.env.ADMIN_KEY) {
          return true;
        } else {
          return false;
        }
      };
      
    // Verify request
    const uid = await verifyRequest(auth, secret, idToken, req, res);
    if (uid) {
        // ! Temporary checking, delete soon
      const admin = await adminRoleCheck(uid);
      if (admin) {
        try {
          const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: question }],
            temperature: 0.5,
          });
          res.status(200).json({ answer: completion.data.choices[0].message.content });
        } catch (err) {
          if (err.response) {
            console.error(err.response.status, err.response.data);
            res.status(err.response.status).json(err.response.data);
          } else {
            console.error(`Error with OpenAI API request: ${err.message}`);
            res.status(500).json({
              error: {
                message: "An error occurred during your request.",
              },
            });
          }
        }
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export default csrf(openAi);
