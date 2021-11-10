const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const address = require('./address');

const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false,
        // required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    gender: {
        type: String
    },
    address: [{
        type: Schema.Types.ObjectId,
        ref: address
    }],
    cartItems: [{
        type: Schema.Types.ObjectId
    }],
    googleId: {
        type: String,
    },
    phoneNumber: {
        type: 'String',
        default: null
    },
    GstNumber: {
        type: 'String',
        default: null
    },
    PanNumber: {
        type: 'String',
        default: null
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    isAllowed: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

var Users = mongoose.model('User', userSchema);

module.exports = Users;