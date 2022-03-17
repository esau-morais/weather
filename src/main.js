require("dotenv").config()
const nodemailer = require("nodemailer");

(async function main() {
    console.log("🚀 Running weather report");

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER_EMAIL, 
          pass: process.env.MAIL_USER_PASS, 
        },
      });

      await transporter.sendMail({
        from: `"Esaú Morais 🧑‍💻" <${process.env.MAIL_FROM}>`, // sender address
        to: process.env.MAIL_TO, // list of receivers
        subject: "✔ Daily weather report", // Subject line
        text: `
            Daily weather report
        `, // plain text body
        html: `
            <h1>Daily weather report</h1>
        `, // html body
      });
})()    