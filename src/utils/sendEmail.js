const config = require("./config");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: config.EMAIL,
    pass: config.EMAIL_PASS,
  },
});

sendEmail = async ({ from, to, subject, html }) => {
  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
  console.log(`Order Confirmation sent to ${to}!`);
};

module.exports = { sendEmail };
