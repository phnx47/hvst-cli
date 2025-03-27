import nodemailer from "nodemailer";

const { MAIL_SERVER_ADDRESS, MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM, MAIL_TO } = process.env;

export async function sendEmail({ subject, text }) {
  if (!MAIL_SERVER_ADDRESS)
    throw new Error("Environment variable 'MAIL_SERVER_ADDRESS' is not defined");
  if (!MAIL_USERNAME) throw new Error("Environment variable 'MAIL_USERNAME' is not defined");
  if (!MAIL_PASSWORD) throw new Error("Environment variable 'MAIL_PASSWORD' is not defined");
  if (!MAIL_FROM) throw new Error("Environment variable 'MAIL_FROM' is not defined");
  if (!MAIL_TO) throw new Error("Environment variable 'MAIL_TO' is not defined");

  const transporter = nodemailer.createTransport({
    host: MAIL_SERVER_ADDRESS,
    port: 587,
    secure: false,
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: MAIL_FROM,
    to: MAIL_TO,
    subject,
    text,
  });

  console.log(`Report sent to Email: '${info.messageId}'`);
}
