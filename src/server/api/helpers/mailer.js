require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

async function sendEmail(email, code) {
  try {
    const oauth2Client = new OAuth2(
      process.env.GOOGLE_ID, // ClientID
      process.env.GOOGLE_SECRET, // Client Secret
      "https://developers.google.com/oauthplayground" // Redirect URL
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    // Get access token and catch any errors
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }); // Get the access token
    });

    const smtpEndpoint = "smtp.gmail.com";
    const senderAddress = "DJ <dj@djcyphers.com>";
    var toAddress = email;
    const smtpUsername = process.env.GOOGLE_USER;
    var subject = "Verify your email";
    // The body of the email for recipients
    var body_html = `<!DOCTYPE>
    <html>
      <body>
        <p>Your authentication code is : </p> <b>${code}</b>
      </body>
    </html>`;
    // Create the SMTP transport.
    let transporter = nodemailer.createTransport({
      host: smtpEndpoint,
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: smtpUsername,
        accessToken,
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        tls: {
          rejectUnauthorized: false,
        },
      },
    });
    // Specify the fields in the email.
    let mailOptions = {
      from: senderAddress,
      to: toAddress,
      subject: subject,
      html: body_html,
    };
    // Send the email.
    let info = await transporter.sendMail(mailOptions);
    return { info, error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Cannot send email",
    };
  }
}

async function sendContact(email, msg, name, subject) {
  try {
    // Authorize for sending email through contact form
    const oauth2Client = new OAuth2(
      process.env.GOOGLE_ID, // ClientID
      process.env.GOOGLE_SECRET, // Client Secret
      "https://developers.google.com/oauthplayground" // Redirect URL
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    // Get access token and catch any errors
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }); // Get the access token
    });
    const smtpEndpoint = "smtp.gmail.com";
    var toAddress = "DJ <dj@djcyphers.com>";
    const smtpUsername = process.env.GOOGLE_USER;
    var subject = subject;
    var email = email;
    // The body of the email for recipients
    var body_html = `<!DOCTYPE>
    <html>
      <body>
      <h2> Subject: ${ subject }</h2>
        <p> From: ${ name }</p>
        <p> Email Address: ${ email }</p>
        <p> ${ msg } </b>
      </body>
    </html>`;
    // Create the SMTP transport.
    let transporter = nodemailer.createTransport({
      host: smtpEndpoint,
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: smtpUsername,
        accessToken,
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        tls: {
          rejectUnauthorized: false,
        },
      },
    });
    // Specify the fields in the email.
    const mailOptions = {
      from: email,
      to: toAddress,
      subject: subject,
      html: body_html,
    };
    // Send the email.
    let info = await transporter.sendMail(mailOptions);
    return { info, error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Cannot send email",
    };
  }
}

module.exports = { sendEmail, sendContact };
