import { Mailer } from "nodemailer-react";
import { google } from "googleapis";

import { OrderConfirmationEmail } from "../../../utils/emails/OrderConfirmationEmail";

export default async function handler(req, res) {
  try {
    //First generate access token for 0Auth2
    const OAuth2 = google.auth.OAuth2;
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

    const mailerConfig = {
      transport: {
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.GOOGLE_EMAIL,
          accessToken,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        },
        tls: { rejectUnauthorized: false },
      },
      defaults: {
        from: { name: "Bright Light Gypsy", address: "brightlightgypsy@gmail.com" },
      },
    };

    /** Record of all emails that will be available */
    const emailsList = {
      OrderConfirmationEmail,
    };

    /** Instance of mailer to export */
    const mailer = Mailer(mailerConfig, emailsList);

    /**
     * Send mail in your application, by passing:
     * - Your email template name: key of the email in the record you've provided.
     * - The props of your email component
     * - The options of email (to, from, attachments, etc.) @see https://nodemailer.com/message/
     */

    /** A first email sent */
    await mailer.send(
      "OrderConfirmationEmail",
      {
        firstName: "Aga",
        brand: "Bright Light Gypsy",
      },
      {
        to: "kuba.kapek@gmail.com",
        //   attachments: [{ content: "bar", filename: "foo.txt" }],
      }
    );
    res.status(200).send("OK");
  } catch (err) {
    res.status(500).send(err.message);
  }
}
