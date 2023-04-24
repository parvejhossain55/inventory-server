const orderStatusTemplate = ({ orderId, name, date, status }) => {
  return `
    <body style="background-color: #f7f7f7; font-family: Arial, sans-serif; font-size: 16px; color: #333333; margin: 0; padding: 0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto;">
    <tr>
      <td style="background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; color: #0066cc;">Order Status Update</h1>
        <p style="margin-bottom: 20px;">Dear [ ${name} ],</p>
        <p style="margin-bottom: 20px;">We would like to inform you that the status of your order has been updated.</p>
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 20px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); border-radius: 10px;">
          <tr>
            <td style="font-weight: bold; padding-right: 20px;">Order ID :</td>
            <td>${orderId}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-right: 20px;">Order Status :</td>
            <td>${status}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; margin-bottom: 20px;">If you have any questions or concerns, please feel free to contact us.</p>
        <p style="text-align: center; font-size: 14px; color: #666666;">&copy; 2023 My Ecommerce Website. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
    `;
};

module.exports = orderStatusTemplate;
