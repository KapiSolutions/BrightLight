

export const OrderConfirmationEmail = ({ firstName }) => ({
  // subject: newAccount ? `Welcome to ${brand}!` : `Your new ${brand} password.`,
  subject: "Order confirmation",
  body: (
    <body>
      <h1>Hello {firstName},</h1>
      <p>Your order is placed!</p>
    </body>
  ),
})