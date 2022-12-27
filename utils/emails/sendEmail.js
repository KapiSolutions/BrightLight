import nodemailer from "nodemailer";
import handlebars from "handlebars";
import { google } from "googleapis";
import path from "path";
import { promises as fs } from "fs";
import getConfig from 'next/config'

//email templates:
import orderConfirmation from "./en/order-confirmation";
import paymentConfirmation from "./en/payment-confirmation";

export default async function sendEmail(emailType, data, language) {
  const OAuth2 = google.auth.OAuth2;
  let emailData = null;
  let replacements = null;
  const { serverRuntimeConfig } = getConfig()

  switch (emailType) {
    case "orderConfirmation":
      const { emailData_oc, replacements_oc } = orderConfirmation(data);
      emailData = emailData_oc;
      replacements = replacements_oc;
      break;
    case "paymentConfirmation":
      const { emailData_pc, replacements_pc } = paymentConfirmation(data);
      emailData = emailData_pc;
      replacements = replacements_pc;
      break;

    default:
      throw "invalid email type.";
  }

  //Read html file and replace variables with the values
  // const filePath = path.join(process.cwd(), `utils/emails/${language}/${emailData.emailFilePath}/index.html`);
  const filePath = path.join(serverRuntimeConfig.PROJECT_ROOT, `./utils/emails/${language}/${emailData.emailFilePath}/index.html`);
  console.log("cwd: ", process.cwd())
  console.log("dir ", __dirname)
  const fileContents = await fs.readFile(filePath, "utf8");
  const template = handlebars.compile(fileContents.toString());
  const htmlToSend = template(replacements);

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
        tls: { rejectUnauthorized: false },
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
    } catch (err) {
      throw err;
    }
  };

  sendEmail({
    from: {
      name: "Bright Light Gypsy",
      address: process.env.GOOGLE_EMAIL,
    },
    to: emailData.emailTo,
    subject: emailData.emailSubject,
    html: htmlToSend,
  });
}
