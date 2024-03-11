const nodemailer = require('nodemailer');
require('dotenv').config() 

const sendEmail = async (to, subject, text) => {
    
    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASSWORD, 
        },
    });

    
    let info = await transporter.sendMail({
        from: `"RemindMe" <${process.env.EMAIL_USER}>`, 
        to: to, 
        subject: subject, 
        text: text, 
    });

    console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;