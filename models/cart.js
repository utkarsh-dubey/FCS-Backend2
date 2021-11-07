const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const product = require('./product');
const user = require('./user');
const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: user
    },
    products: [{

        productId:{type: Schema.Types.ObjectId, ref: product},
        quantity: {type: Number}

    }]
    // products: [Schema.Types.Mixed]
});

var Carts = mongoose.model('carts', cartSchema);
module.exports = Carts;