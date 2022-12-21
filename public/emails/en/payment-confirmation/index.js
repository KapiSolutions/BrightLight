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
  
    const emailData_pc = {
      emailTo: data.userEmail,
      emailSubject: `Successful payment! (order: ${data.orderID})`,
      emailFilePath: "payment-confirmation",
      userName: data.userName,
    };
    const replacements_pc = {
      userName: data.userName,
      orderID: data.orderID,
      amountPaid: data.amountPaid,
      orderItems: items,
      totalPrice: data.totalPrice,
      paymentMethod: data.paymentMethod,
      paymentID: data.paymentID,
      timeCreate: data.timeCreate,
      timePayment: data.timePayment
    };
  
    return { emailData_pc, replacements_pc };
  }
  