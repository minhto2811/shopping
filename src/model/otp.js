const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const Otp = new Schema({
    username: { type: String, require: true },
    otp: { type: String, require: true },
    time: { type: Date, default: Date.now, index: { expires: 120 } }
}, {
    collection: "Otp"
});



module.exports = mongoose.model('Otp', Otp);