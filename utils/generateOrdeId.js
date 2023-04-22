const generateOrderId = () => {
  const chars = "ABCDEF123456789GHIJKLMNOPQ123456789RSTUVWXYZ0123456";
  let orderId = "";
  for (let i = 0; i < 18; i++) {
    if (i === 4 || i === 9 || i === 14) {
      orderId += "-";
    } else {
      orderId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return orderId;
};

module.exports = generateOrderId;
