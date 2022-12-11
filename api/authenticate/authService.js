const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log(process.env.SENDGRID_API_KEY);

function forgotPassword(email) {
  const tempPass = (Math.random() + 1).toString(36).substring(2);
  cache.set(email, tempPass, 1800);
  console.log(email);
  const msg = {
    to: email,
    from: {
      email: "phucyugi@gmail.com",
      name: "Classroom SPA",
    },
    subject: "Request password",
    text: "Don't forget your password. Password will expired in 30 minutes.",
    html: `<p>Don't forget to reset your password. Password will expired in 30 minutes.
    Now here's your new password: <strong>${tempPass}</strong></p>`,
  };

  return sgMail
    .send(msg)
    .then((response) => {
      return true;
    })
    .catch((error) => {
      return false;
    });
}

module.exports = { forgotPassword };
