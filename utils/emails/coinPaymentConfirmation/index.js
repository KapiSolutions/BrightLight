export default function orderConfirmation(data) {
  let item = `
            <div class="OrderItem">
              <img class="OrderImg" src="https://firebasestorage.googleapis.com/v0/b/brightlight-443b7.appspot.com/o/images%2Femails%2Fcoins.png?alt=media&token=4bbcadd2-fac6-427e-a774-6c84d1ffca9c" alt="Bright Coin - Bright Light Gypsy tarot" />
              <p class="OrderItemName"><strong>${data.coin}</strong></p>
              <p class="OrderItemPrice"><strong>${data.coinsToAdd} x ${data.unitPrice.toFixed(2)} <span style="text-transform: uppercase">${data.currency}</span></strong></p>
            </div>
            `;

  const emailData_cp = {
    emailTo: data.userEmail,
    emailSubject: `${data.language == "en" ? "Successful payment!" : "Potwierdzenie płatności"} (zamówienie: ${
      data.orderID
    })`,
    userName: data.userName,
  };
  const replacements_cp = {
    userName: data.userName,
    orderID: data.orderID,
    amountPaid: data.amountPaid,
    orderItems: item,
    totalPrice: data.totalPrice,
    currency: data.currency,
    paymentMethod: data.paymentMethod,
    paymentID: data.paymentID,
    timePayment: data.timePayment,
  };

  return { emailData_cp, replacements_cp };
}
