import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SG_KEY);

const sendSGMail = async ({ to, sender, subject, html, attachments, text }) => {
  try {
    const from = "duyka6203@gmail.com";

    const msg = {
      to: to, // Change to your recipient
      from: from, // Change to your verified sender
      subject: subject,
      html: html,
      text: text,
      attachments,
    };

    return sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
};

export const sendEmail = async (args) => {
  if (!process.env.NODE_ENV === "development") {
    return Promise.resolve();
  } else {
    return sendSGMail(args);
  }
};
