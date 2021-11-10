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
    createdOn: {
        type: Date,
        default: new Date()
    }
});

var Otp= mongoose.model('otps', otpSchema);
module.exports = Otp;