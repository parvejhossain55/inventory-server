const orderTemplate = ({ orderId, amount, date }) => {
  return `<body style="background-color: #f7f7f7; font-family: Arial, sans-serif; font-size: 16px; color: #333333; margin: 0; padding: 0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto;">
    <tr>
      <td style="background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; color: #0066cc;">Order Confirmation</h1>
        <p style="margin-bottom: 20px;">Thank you for your order! Your order has been received and is being processed. Your order details are below:</p>
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 20px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); border-radius: 10px;">
          <tr>
            <td style="font-weight: bold; padding-right: 20px;">Order ID :</td>
            <td>${orderId}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-right: 20px;">Order Date :</td>
            <td>${date}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-right: 20px;">Amount :</td>
            <td>${amount}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; margin-bottom: 20px; text-align: center;"><a href="#" style="display: inline-block; padding: 10px 20px; background-color: #0066cc; color: #ffffff; border-radius: 5px; text-decoration: none;">View Order</a></p>
        <p style="text-align: center; font-size: 14px; color: #666666;">&copy; 2023 My Ecommerce Website. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>`;
};

module.exports = orderTemplate;
