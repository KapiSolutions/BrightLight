export default function unpaidNotification(data) {
  let items = "";
  data.items.forEach((item) => {
    items =
      items +
      `
          <div class="OrderItem">
            <img class="OrderImg" src="${item.image}" alt="${item.name} - Bright Light Gypsy tarot" />
            <p class="OrderItemName">${item.name}</p>
            <p class="OrderItemPrice">${item.price} <span style="text-transform: uppercase">${item.currency}</span></p>
          </div>
          `;
  });

  const emailData_un = {
    emailTo: data.userEmail,
    emailSubject: `${data.language == "en" ? "Missing payment":"Brakująca płatność"} (${data.orderID})`,
    userName: data.userName,
  };
  const replacements_un = {
    userName: data.userName,
    orderID: data.orderID,
    orderItems: items,
    totalPrice: data.totalPrice,
    currency: data.currency,
    timeCreate: data.timeCreate
  };

  return { emailData_un, replacements_un };
}
