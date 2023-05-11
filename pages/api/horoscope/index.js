import axios from "axios";
import { csrf } from "../../../config/csrf";

const getGeneralHoroscope = async (when, sign) => {
  try {
    const response = await axios.get(
      `https://www.horoscope.com/us/horoscopes/general/horoscope-general-daily-${when}.aspx?sign=${sign}`
    );
    // Get paragraph
    const startTmp = response.data.indexOf("<p><strong>");
    const stopTmp = startTmp + response.data.substring(startTmp).indexOf("</p>");
    const tmp = response.data.slice(startTmp, stopTmp + 4);
    // Get text form the paragraph without initial date
    const start = tmp.indexOf("-");
    const stop = start + tmp.substring(start).indexOf("</p>");
    const final = tmp.slice(start + 1, stop);
    return final;
  } catch (e) {
    throw e;
  }
};

async function getHoroscope(req, res) {
  const { when, sign } = req.query;

  if (req.method === "GET") {
    try {
      const generalHoroscope = await getGeneralHoroscope(when, sign);
      res.status(200).json({ general: generalHoroscope });
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
}

export default csrf(getHoroscope);
