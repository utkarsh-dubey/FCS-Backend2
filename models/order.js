// for transaction logs

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const product = require('./product');
const user = require('./user');

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: user,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending','Success','Failed']
    },
    amount: {
        type: Number,
        required: true
    },
    item: [{

        productId:{type: Schema.Types.ObjectId, ref: product},
        quantity: {type: Number}

    }],
    createdOn: {
        type: Date,
        default: new Date()
    }
});


var Order = mongoose.model('orders', orderSchema);
module.exports = Order;