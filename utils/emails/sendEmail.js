import nodemailer from "nodemailer";
import handlebars from "handlebars";
import { google } from "googleapis";
import path from "path";
import { promises as fs } from "fs";
//email templates:
import orderConfirmation from "./orderConfirmation";
import paymentConfirmation from "./paymentConfirmation";
import orderFinished from "./orderFinished";
import unpaidNotification from "./unpaidNotification";
import orderCancelled from "./orderCancelled";
import coinPaymentConfirmation from "./coinPaymentConfirmation";

export default async function sendEmail(emailType, data, language) {
  await new Promise(async (resolve, reject) => {
    try {
      const OAuth2 = google.auth.OAuth2;
      let emailData = null;
      let replacements = null;

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
        case "orderFinished":
          const { emailData_of, replacements_of } = orderFinished(data);
          emailData = emailData_of;
          replacements = replacements_of;
          break;
          case "unpaidNotification":
          const { emailData_un, replacements_un } = unpaidNotification(data);
          emailData = emailData_un;
          replacements = replacements_un;
          break;
          case "orderCancelled":
          const { emailData_occ, replacements_occ } = orderCancelled(data);
          emailData = emailData_occ;
          replacements = replacements_occ;
          break;
          case "coinPaymentConfirmation":
          const { emailData_cp, replacements_cp } = coinPaymentConfirmation(data);
          emailData = emailData_cp;
          replacements = replacements_cp;
          break;

        default:
          throw "invalid email type.";
      }

      //Read html file and replace variables with the values
      const filePath = path.join(process.cwd(), `utils/emails/${emailType}/${language}/index.html`);
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
          resolve(true);
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
    } catch (error) {
      reject(error);
    }
  });
}
