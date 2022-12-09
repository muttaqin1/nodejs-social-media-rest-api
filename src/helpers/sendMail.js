const nodemailer = require('nodemailer')

module.exports = async ({ title, body, emailReciever }) => {
    const mailOptions = {
        from: SMTP_EMAIL,
        to: emailReciever,
        subject: title,
        text: body,
    }
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD,
        },
        port: 465,
        host: 'smtp@gmail.com',
    })
    await transporter.sendMail(mailOptions)
    return true
}
