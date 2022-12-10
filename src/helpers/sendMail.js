const nodemailer = require('nodemailer')
const { smtpEmail, smtpPassword } = require('../config')

module.exports = async ({ title, body, emailReciever }) => {
    const mailOptions = {
        from: smtpEmail,
        to: emailReciever,
        subject: title,
        text: body,
    }
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: smtpEmail,
            pass: smtpPassword,
        },
        port: 465,
        host: 'smtp@gmail.com',
    })
    await transporter.sendMail(mailOptions)
    return true
}
