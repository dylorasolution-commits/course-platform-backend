const nodemailer = require("nodemailer");

const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure =
  process.env.SMTP_SECURE === "true" || smtpPort === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw error;
  }
};
