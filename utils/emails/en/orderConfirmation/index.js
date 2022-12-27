export default function orderConfirmation(data) {
  let items = "";
  data.cartItems.forEach((item) => {
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

  const emailData_oc = {
    emailTo: data.userEmail,
    emailSubject: `Order confirmation (${data.orderID})`,
    userName: data.userName,
  };
  const replacements_oc = {
    userName: data.userName,
    orderID: data.orderID,
    orderDate: data.orderDate,
    orderItems: items,
    totalPrice: data.totalPrice,
    timeCreate: data.timeCreate
  };

  return { emailData_oc, replacements_oc };
}
