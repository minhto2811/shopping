
const User = require('../model/user')
const Otp = require('../model/otp')
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt');
const { sendEmail } = require('../ultils/emailSender')
const { uploadImage, deleteImage } = require('../ultils/uploadImage')

class ApiController {
    async insertOtp(req, res) {
        const username = req.body.username
        console.log(username)
        try {
            const user = await User.find({ username: username })
            console.log(user.length)
            if (user.length > 0) {
                res.status(200).json({ code: 200, message: "Người dùng đã tồn tại" })
                return
            }
            const num = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            const salt = await bcrypt.genSalt(10)
            const otp = await bcrypt.hash(num, salt)
            const numberPhonePattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
            const isNumberPhone = numberPhonePattern.test(username)
            if (isNumberPhone) {
                console.log("isNumberPhone")
                // gửi otp sms 


            } else {
                const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
                const isEmail = emailPattern.test(username)
                if (isEmail) {
                    console.log("isEmail")
                    const subject = "Xác nhận email"
                    const text = `Mã xác nhận của bạn là ${num}`
                    sendEmail(username, subject, text)
                } else {
                    throw "Tài khoản không hợp lệ"
                }
            }
            const rs = await Otp.create({ username: username, otp: otp })
            console.log(rs)
            res.status(200).json({ code: 200, message: "Tạo otp thành công" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ code: 500, message: "Tạo otp thất bại" })
        }
    }

    async verifyOtp(req, res) {
        const username = req.body.username
        const otp = req.body.otp
        try {
            const otpHolder = await Otp.find({ username: username })
            if (!otpHolder.length) {
                return res.status(404).json({ code: 404, message: "Mã xác minh hết hạn" })
            }
            const hashOtp = otpHolder[otpHolder.length - 1].otp
            const matches = await bcrypt.compare(otp, hashOtp)
            if (matches) {
                await Otp.deleteMany({ username: username })
                return res.json({ code: 200, message: "Xác nhận mã thành công" })
            }
            res.json({ code: 404, message: "Mã xác minh không chính xác" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ code: 500, message: "Đã xảy ra lỗi" })
        }

    }

    async createAccount(req, res) {
        const account = req.body
        try {
            const salt = await bcrypt.genSalt(10)
            const password = account.password
            const hashPass = await bcrypt.hash(password, salt)
            account.password = hashPass
            if (req.file != null && req.file != undefined) {
                const filename = req.file.filename;
                const filepath = req.file.path;
                const url = await uploadImage(filepath, filename);
                account.image = url;
            }
            const user = await User.create(account)
            console.log(user)
            res.json({ code: 200, message: "Tạo tài khoản thành công" })
        } catch (error) {
            console.log(error)
            res.json({ code: 500, message: "Tạo tài khoản thất bại" })
        }

    }
}





module.exports = new ApiController;