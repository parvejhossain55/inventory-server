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

    const mail = await transporter.sendMail(mailOptions);
    return mail;
  } catch (error) {
    throw new Error("Failed to Send Email");
  }
};
