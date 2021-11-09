const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('./user');

const otpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
    creadtedOn: {
        type: Date
    }
});

var Otp= mongoose.model('otps', otpSchema);
module.exports = Otp;