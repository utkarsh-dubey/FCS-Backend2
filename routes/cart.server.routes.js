const express = require('express');
const cartRouter = express.Router();
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
//models
const User = require('../models/user');
const Cart = require('../models/cart');
const Product = require('../models/product');
const mailer = require('./mailer');

cartRouter.post("/add", (req, res) => {


    Product.findById(req.body.productId).exec((err, product) => {

        if (err) {
            return res.status(400).send({ "message": "some error occured in db" });

        }
        if (req.body.quantity > product.quantity) {
            req.body.quantity = product.quantity;
        }

        Cart.findOneAndUpdate({ "user": req.body.userId }, { "$set": { "user": req.body.userId }, "$addToSet": { "products": { "productId": ObjectId(req.body.productId), "quantity": req.body.quantity } } }, { "new": true, "upsert": true })
            .populate('products.productId').exec((err, cart) => {

                if (err) {
                    return res.status(400).send({ "message": "some error occured in db" });

                }

                return res.status(200).send(cart);
            });

    });

});

cartRouter.get("/:id", (req, res) => {

    Cart.find({ user: req.params.id }).populate('products.productId').exec((err, cart) => {
        if (err) {
            return res.status(400).send({ "message": "some error occured in db" });

        }
        return res.status(200).send(cart);
    });
});


cartRouter.get("/checkout/:id",(req,res) =>{

    
});


// const mailData = {
//     recv: "robin19092@iiitd.ac.in",
//     otp: {
//         "verificationOtp": 12345
//     }
// };

// mailer(mailData).then((value) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({
//         msg: 'Otp sent'
//     });
// })
// .catch((err) => {
//     console.log(err);
//     res.statusCode = 400;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({
//         msg: 'otp send failed'
//     });
// });







module.exports = cartRouter;