const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId
    },
    products: [{
        type: Schema.Types.ObjectId,
    }]
});

var Carts = mongoose.model('carts', cartSchema);
module.exports = Carts;