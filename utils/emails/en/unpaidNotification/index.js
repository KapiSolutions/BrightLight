export default function unpaidNotification(data) {
  let items = "";
  data.items.forEach((item) => {
    items =
      items +
      `
          <div class="OrderItem">
            <img class="OrderImg" src="${item.image}" alt="Item icon" />
            <p class="OrderItemName">${item.name}</p>
            <p class="OrderItemPrice">${item.price},00 PLN</p>
          </div>
          `;
  });

  const emailData_un = {
    emailTo: data.userEmail,
    emailSubject: `Missing payment (${data.orderID})`,
    userName: data.userName,
  };
  const replacements_un = {
    userName: data.userName,
    orderID: data.orderID,
    orderItems: items,
    totalPrice: data.totalPrice,
    timeCreate: data.timeCreate
  };

  return { emailData_un, replacements_un };
}
