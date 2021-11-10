const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('./user');

const pdfSchema = new Schema({
    sellerId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: user
    },
    name:{
        type: String,
        default: "noName"
    },
    pdf: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isRejected: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    }
});


var PDF= mongoose.model('pdfs', pdfSchema);
module.exports = PDF;