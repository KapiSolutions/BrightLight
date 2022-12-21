import sendEmail from "../../../utils/emails/sendEmail.js";

//Email testing
export default async function handler(req, res) {
  try {
    const data = {
      orderID: "1f44af2c-9cac4",
      orderDate: "11.12.2022 8:23:02",
      userName: "Jacob",
      userEmail: "kuba.kapek@gmail.com",
      cartItems: [
        {
          name: "item 1",
          price: 19,
          image:
            "https://firebasestorage.googleapis.com/v0/b/brightlight-443b7.appspot.com/o/images%2Fcards%2Flovers.png?alt=media&token=d911cee3-3c3f-439a-a80f-07dc14defbc6",
        },
        {
          name: "item 2",
          price: 23,
          image:
            "https://firebasestorage.googleapis.com/v0/b/brightlight-443b7.appspot.com/o/images%2Fcards%2Flovers.png?alt=media&token=d911cee3-3c3f-439a-a80f-07dc14defbc6",
        },
      ],
      totalPrice: 40,
      amountPaid: 23,
      datePaid: "11.12.2022 8:23:02",
      paymentMethod: "VISA",
      paymentID: "2312wdawe12d",
    };

    await sendEmail("paymentConfirmation", data, "en");

    res.status(200).end("OK");
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
}
