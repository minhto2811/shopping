const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const User = new Schema({
    fullname: { type: String, require: true },
    avatar: { type: String, require: true },
    role: { type: Boolean, default: false },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    enable: { type: Boolean, default: true },
    rewardPoints: { type: Number, default: 0 }
}, {
    collection: "User"
});



module.exports = mongoose.model('User', User);