const appConfig = () => {
  const config = {
    timeRealization: 48, //[hours], timeout for realiztion of the order
    timePayment: 48, //[hours], timeout for the payment
    timeExtraPayment: 24, //[hours], extra time  for the payment(after receiving the notification)
  };
  return config;
};

export default appConfig;
