export default function orderFinished(data) {
  let items = "";
  data.items.forEach((item) => {
    items =
      items +
      `
      <div class="OrderItem">
      <div class="OrderHeader">
        <img class="OrderImg" src="${item.image}" alt="Item icon" />
        <p class="OrderItemName"><strong>${item.name}</strong></p>
        <p class="OrderItemPrice"><strong>${item.price},00 PLN</strong></p>
      </div>
      <div>
        <hr class="hLine" />
        <p>Your Cards:</p>
        <p class="OrderItemText"><small>${item.cards}</small></p>
      </div>
      <div>
        <hr class="hLine" />
        <p>Your Question:</p>
        <p class="OrderItemText"><small>${item.question}</small></p>
      </div>
      <div>
        <hr class="hLine" />
        <p><strong>Answer:</strong></p>
        <p class="OrderItemText"><small>${item.answer}</small></p>
      </div>
    </div>
          `;
  });

  const emailData_of = {
    emailTo: data.userEmail,
    emailSubject: `Your order is Ready! (${data.orderID})`,
    userName: data.userName,
  };
  const replacements_of = {
    userName: data.userName,
    orderID: data.orderID,
    items: items,
    totalPrice: data.totalPrice,
  };

  return { emailData_of, replacements_of };
}
