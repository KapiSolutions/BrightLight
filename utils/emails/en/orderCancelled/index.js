export default function orderCancelled(data) {
  const emailData_occ = {
    emailTo: data.userEmail,
    emailSubject: `Order cancelled (${data.orderID})`,
    userName: data.userName,
  };
  const replacements_occ = {
    userName: data.userName,
    orderID: data.orderID,
  };

  return { emailData_occ, replacements_occ };
}
