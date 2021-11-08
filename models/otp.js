const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('./user');

const otpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: user,
        required: true
    },
    otp:{
        type: Number,
        required: true
    },
    creadtedOn: {
        type: Date
    }
});

var Otp= mongoose.model('otps', otpSchema);
module.exports = Otp;