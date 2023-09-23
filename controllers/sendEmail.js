const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, template) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailoptions = {
      from: process.env.EMAIL_HOST,
      to: email,
      subject: subject,
      html: template,
    };
    await transporter.sendMail(mailoptions);
    return "Email sent";
  } catch (error) {
    return error.message;
  }
};

module.exports = { sendEmail };
