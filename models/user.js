const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
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
        type: Schema.Types.ObjectId
    }],
    cartItems: [{
        type: Schema.Types.ObjectId
    }],
    googleId: {
        type: String,
    }
}, { timestamps: true });

var Users = mongoose.model('User', userSchema);

module.exports = Users;