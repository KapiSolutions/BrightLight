export default function orderFinished(data) {
  let items = "";
  data.items.forEach((item) => {
    items =
      items +
      `
      <div class="OrderItem">
      <div class="OrderHeader">
        <img class="OrderImg" src="${item.image}" alt="${item.name[data.language]} - Bright Light Gypsy tarot" />
        <p class="OrderItemName"><strong>${item.name[data.language]}</strong></p>
        <p class="OrderItemPrice"><strong>${item.price[data.currency].amount} <span style="text-transform: uppercase">${data.currency}</span></strong></p>
      </div>
      <div>
        <hr class="hLine" />
        <p>${data.language == "en" ? "Your Cards:":"Twoje karty:"}</p>
        <p class="OrderItemText"><small>${item.cards}</small></p>
      </div>
      <div>
        <hr class="hLine" />
        <p>${data.language == "en" ? "Your Question:":"Twoje pytanie:"}</p>
        <p class="OrderItemText"><small>${item.question}</small></p>
      </div>
      <div>
        <hr class="hLine" />
        <p><strong>${data.language == "en" ? "Answer:":"Odpowiedź:"}</strong></p>
        <p class="OrderItemText"><small>${item.answer}</small></p>
      </div>
    </div>
          `;
  });

  const emailData_of = {
    emailTo: data.userEmail,
    emailSubject: `${data.language == "en" ? "Your order is Ready!":"Zamówienie gotowe!"} (${data.orderID})`,
    userName: data.userName,
  };
  const replacements_of = {
    userName: data.userName,
    orderID: data.orderID,
    items: items,
    totalPrice: data.totalPrice,
    currency: data.currency,
  };

  return { emailData_of, replacements_of };
}
