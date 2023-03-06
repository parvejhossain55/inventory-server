const nodemailer = require("nodemailer");

exports.SendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = { from: process.env.EMAIL_USER, to, subject, html };

    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error(error);
  }
};
