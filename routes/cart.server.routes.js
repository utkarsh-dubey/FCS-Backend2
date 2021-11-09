const express = require('express');
const cartRouter = express.Router();
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
const authenticate = require('../middleware/authenticate');
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

cartRouter.get("/:id",authenticate.matchIdandJwt, (req, res) => {

    Cart.find({ user: req.params.id }).populate('products.productId').exec((err, cart) => {
        if (err) {
            return res.status(400).send({ "message": "some error occured in db" });
        }
        return res.status(200).send(cart);
    });

});

function getMap(id){

    const mappy = new Promise((resolve, reject) => {
        const map = new Map();
        Cart.find({ user: id }).then((carts) => {
            
            console.log("ssssssssssssssss",carts);
            let cart=carts[0];
            for(let i=0;i<cart.products.length;i++){
                if(!map.has(cart.products[i].productId.toString())){
                    map.set(cart.products[i].productId.toString(),cart.products[i].quantity);
                }
                else{
                    map.set(cart.products[i].productId.toString(),map.get(cart.products[i].productId.toString())+cart.products[i].quantity);
                }
            }
            let count=0;
            for (const [key, value] of map.entries()) {
                Product.findById(key).exec((err, product) => {
                    console.log(product);
                    if(product.quantity<value){
                        map.set(key,product.quantity);
                    }
                    console.log(map);
                });
                count+=1;
            }
            console.log("end of second");
            if(count===map.size){
                resolve(map);
            }
        });
    });

    return mappy;
}

cartRouter.get("/checkout/:id",(req,res) =>{
    


    // let map2 = await getMap(req.params.id);

    getMap(req.params.id).then( (map2) => {

    // Cart.find({ user: req.params.id }).then((carts) => {
    //     return new Promise((resolve, reject) => {
    //     const map = new Map();
    //     let cart=carts[0];
    //     for(let i=0;i<cart.products.length;i++){
    //         if(!map.has(cart.products[i].productId.toString())){
    //             map.set(cart.products[i].productId.toString(),cart.products[i].quantity);
    //         }
    //         else{
    //             map.set(cart.products[i].productId.toString(),map.get(cart.products[i].productId.toString())+cart.products[i].quantity);
    //         }
    //     }
    //     for (const [key, value] of map.entries()) {
    //         Product.findById(key).exec((err, product) => {
    //             console.log(product);
    //             if(product.quantity<value){
    //                 map.set(key,product.quantity);
    //             }
    //             console.log(map);
    //         });
    //     }
    //     console.log("end of second");
    //     resolve(map);
    //     });
    // })
    // .then((map1)=> {
    //     return new Promise((resolve, reject) => {
    //     for (const [key, value] of map1.entries()) {
    //         Product.findById(key).exec((err, product) => {
    //             console.log(product);
    //             if(product.quantity<value){
    //                 map1.set(key,product.quantity);
    //             }
    //             console.log(map1);
    //         });
    //     }
    //     console.log("end of second");
    //     resolve(map1);
    //     });
    // })
    // .then((map2)=>{
        
        Cart.deleteOne({user: req.params.id}).then((ok)=>{
            console.log("checking",map2);
            console.log("cart deleted");
            let check2=0
            for (const [key, value] of map2.entries()) {
                Cart.findOneAndUpdate({ "user": req.params.id }, { "$set": { "user": req.params.id }, "$addToSet": { "products": { "productId": ObjectId(key), "quantity": value } } }, { "new": true, "upsert": true })
                .populate('products.productId').exec((err, cart) => {
                    if (err) {
                        return res.status(400).send({ "message": "some error occured in db" });
                    }
                });
                check2+=1;
            }
            if(check2===map2.size){
                Cart.find({ user: req.params.id }).populate('products.productId').exec((err, cart) => {
                    return res.status(200).send(cart);
                });
            }
        }).catch((err)=>{
            console.log(err);
        });
    });
    
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