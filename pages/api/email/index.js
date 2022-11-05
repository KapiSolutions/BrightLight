import nodemailer from "nodemailer";
import { google } from "googleapis";

export default async function handler(req, res) {
  const OAuth2 = google.auth.OAuth2;

  const createTransporter = async () => {
    const oauth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject("Failed to create access token :(");
        }
        resolve(token);
      });
    });
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.GOOGLE_EMAIL,
          accessToken,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        },
        tls : { rejectUnauthorized: false }
      });
      return transporter;
    } catch (err) {
      console.error(err);
    }
  };

  const sendEmail = async (emailOptions) => {
    try {
      let emailTransporter = await createTransporter();
      await emailTransporter.sendMail(emailOptions);
      res.status(200).end("OK")
    } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
    }
  };

  sendEmail({
    from: process.env.GOOGLE_EMAIL,
    to: "kuba.kapek@gmail.com",
    subject: "Test",
    html: "<h1>Header2</h1><p>some text</p>"
  });
};


