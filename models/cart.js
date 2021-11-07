const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId
    },
    products: [{
        
        productId:{type: Schema.Types.ObjectId},
        quantity: {type: Number}

    }]
});

var Carts = mongoose.model('carts', cartSchema);
module.exports = Carts;