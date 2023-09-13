const nodemailer = require('nodemailer')
require('dotenv').config()
const EMAIL = process.env.EMAIL
const PASS = process.env.PASS

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: EMAIL,
        pass: PASS
    }
})

// Hàm để gửi email
function sendEmail(to, subject, text) {
    const mailOptions = {
        from: EMAIL, // Địa chỉ email nguồn
        to, // Địa chỉ email đích
        subject, // Tiêu đề email
        text // Nội dung email dạng văn bản
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Gửi email thất bại:', error)
        } else {
            console.log('Email đã được gửi:', info.response)
        }
    })
}

module.exports = { sendEmail }
