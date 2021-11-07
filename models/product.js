const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        sellerId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        sku: {
            type: String,
            required: true,
            unique: true
        },
        price: {
            type: Number,   //in paise
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
        }
});


var Product = mongoose.model('product', productSchema);

module.exports = Product;