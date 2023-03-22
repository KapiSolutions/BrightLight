import { csrf } from "../../../config/csrf";
import axios from "axios";

const validateCaptcha = async (captcha) => {
  const secret_key = process.env.RECAPTCHA_SERVER_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${captcha}`;

  try {
    const res = await axios.post(url);
    if (res.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

async function handler(req, res) {
  if (req.method === "POST") {
    const { captchaCode } = req.body;
    try {
      const captchaOK = await validateCaptcha(captchaCode);
      if (captchaOK) {
        res.status(200).json({ success: true });
      } else {
        res.status(401).end("Invalid Captcha Code!");
      }
    } catch (error) {
      console.log("error: ", error);
      res.status(500).end(error);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
export default csrf(handler);
