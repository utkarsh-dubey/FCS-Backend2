const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    houseNumber: {
        type: String,
        required: true
    },
    localityName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
});

var Addresses = mongoose.model('Address', addressSchema);
module.exports = Addresses;