const nodemailer = require('nodemailer');
const {
    nodemailer: { smtpEmail, smtpPassword },
} = require('../config');
const { ApiError } = require('./AppError');
module.exports = async ({ title, body, emailReciever }) => {
    try {
        const mailOptions = {
            from: smtpEmail,
            to: emailReciever,
            subject: title,
            text: body,
        };
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: smtpEmail,
                pass: smtpPassword,
            },
            port: 465,
            host: 'smtp@gmail.com',
        });
        await transporter.sendMail(mailOptions);
        return true;
    } catch (e) {
        console.log(e);
        throw new ApiError('Failed to send Email');
    }
};
