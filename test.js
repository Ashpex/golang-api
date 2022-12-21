const sendGridMail = require("@sendgrid/mail");
require("dotenv").config();
console.log("process.env.SENDGRID_API_KEY: ", process.env.SENDGRID_API_KEY);
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

function getMessage() {
  const body = "This is a test email using SendGrid from Node.js";
  console.log("body: ", body);
  return {
    to: "nguyenhuuan1902@gmail.com",
    from: "truongquocvuong1902@gmail.com",
    subject: "Test email with Node.js and SendGrid",
    text: body,
    html: `<strong>${body}</strong>`,
  };
}

// async function sendEmail() {
//   try {
//     await sendGridMail.send(getMessage());
//     console.log("Test email sent successfully");
//   } catch (error) {
//     console.error("Error sending test email");
//     console.error(error);
//     if (error.response) {
//       console.error(error.response.body);
//     }
//   }
// }

// (async () => {
//   console.log("Sending test email");
//   await sendEmail();
// })();

const msg = {
  to: "nguyenhuuan1902@gmail.com",
  from: "truongquocvuong1902@gmail.com",
  subject: "Sending with SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};
sendGridMail
  .send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });
