const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('./user');
const productSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        sellerId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: user
        },
        sku: {
            type: String,
            required: true,
            // unique: true
        },
        images: [{
            type : String
        }
        ],
        price: {
            type: Number,   //in rupee
            required: true
        },
        commission: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        isSoldOut: {
            type: Boolean,
            default: false
        },
        category: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        isAllowed: {
            type: Boolean,
            default: true
        }
});


var Product = mongoose.model('product', productSchema);

module.exports = Product;