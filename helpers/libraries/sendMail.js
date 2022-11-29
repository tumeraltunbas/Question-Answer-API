const nodemailer = require("nodemailer");

const sendEmail = (mailOptions) =>
{
    const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS} = process.env;
    const transporter = nodemailer.createTransport({
        host:SMTP_HOST,
        port:SMTP_PORT,
        auth:{
            user:SMTP_USER,
            pass:SMTP_PASS
        }
    });
    transporter.sendMail(mailOptions);
}


module.exports = sendEmail;