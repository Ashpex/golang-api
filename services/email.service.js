const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
function getOrderConfirmationEmailHtml(customerName, orderNr) {
  return `<p>hello ${customerName} </p>`;
}

function getMessage(emailParams) {
  return {
    to: emailParams.toEmail,
    from: "geshan@yipl.com.np",
    subject: "We have got your order, you will receive it soon",
    text: `Hey ${emailParams.name}, we have received your order ${emailParams.orderNr}. We will ship it soon`,
    html: getOrderConfirmationEmailHtml(emailParams.name, emailParams.orderNr),
  };
}

async function sendOrderConfirmation(emailParams) {
  try {
    await sendGridMail.send(getMessage(emailParams));
    return {
      message: `Order confirmation email sent successfully for orderNr: ${emailParams.orderNr}`,
    };
  } catch (error) {
    const message = `Error sending order confirmation email or orderNr: ${emailParams.orderNr}`;
    console.error(message);
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    return { message };
  }
}

module.exports = {
  sendOrderConfirmation,
};
