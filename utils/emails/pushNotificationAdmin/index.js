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
  
    const emailData_pna = {
      emailTo: "wasikag27@gmail.com",
      emailSubject: `${data.language == "en" ? "New Order!":"Nowe zamówienie!"} (${data.orderID})`,
      userName: "Agusia",
    };
    const replacements_pna = {
      userName: data.userName,
      userEmail: data.userEmail,
      userId: data.userID,
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
  
    return { emailData_pna, replacements_pna };
  }
  