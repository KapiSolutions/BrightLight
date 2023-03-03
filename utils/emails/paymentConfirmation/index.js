export default function orderConfirmation(data) {
    let items = "";
    data.cartItems.forEach((item) => {
      items =
        items +
        `
            <div class="OrderItem">
              <img class="OrderImg" src="${item.image}" alt="${item.name} - Bright Light Gypsy tarot" />
              <p class="OrderItemName">${item.name}</p>
              <p class="OrderItemPrice">${item.price} <span style="text-transform: uppercase">${data.currency}</span></p>
            </div>
            `;
    });
  
    const emailData_pc = {
      emailTo: data.userEmail,
      emailSubject: `${data.language == "en" ? "Successful payment!":"Potwierdzenie płatności"} (zamówienie: ${data.orderID})`,
      userName: data.userName,
    };
    const replacements_pc = {
      userName: data.userName,
      orderID: data.orderID,
      amountPaid: data.amountPaid,
      orderItems: items,
      totalPrice: data.totalPrice,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
      paymentID: data.paymentID,
      timeCreate: data.timeCreate,
      timePayment: data.timePayment
    };
  
    return { emailData_pc, replacements_pc };
  }
  