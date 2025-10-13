const nodemailer = require("nodemailer");

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "keshabooooooooo7@gmail.com",         // Replace with your Gmail
      pass: "hgdpjlfdbsajdzfy",           // Use App Password (not normal password)
    },
  });

  const mailOptions = {
    from: "keshabooooooooo7@gmail.com",
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;