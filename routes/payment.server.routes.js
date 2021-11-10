const express = require('express');
const paymentRouter = express.Router();
const mongoose = require('mongoose');
const Stripe = require('stripe');
var ObjectId = require('mongodb').ObjectId;
const stripe = Stripe("sk_test_51Jt7lhSEpQXgH7SXmbJv8iITVT1gYSvnoz2hznFjRtHIfVxfACOlNmzfeV3vJ9IoCd8Xa0oRihzZDn0itJbScbch00tiT2Kl0W");
const passport = require('passport');
const authenticate = require('../middleware/authenticate');
//models
const User = require('../models/user');
const Cart = require('../models/cart');
const Order = require('../models/order');
const Product = require('../models/product');

// console.log(stripe);
paymentRouter.get('/checkout/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt,async(req,res) =>{
    // console.log("chalra");

    Cart.findOne({user: req.params.id}).populate('user').populate('products.productId').exec(async(err,cart) =>{
        if(err){
            return res.status(404).send({message: "some db error occured"});
        }
        // print(cart)
        console.log(cart);
        if(cart.products.length===0){
            return res.status(400).send({message: "nothing in cart to checkout"});
        }

        let items=[];
        let itemIds=[];
        for(let i=0;i<cart.products.length;i++){
            let item={};
            let itemId={};
            item.price_data={
                currency: 'inr',
                product_data: {
                    name: cart.products[i].productId.name,
                    images: ["check"]
                },
                unit_amount: cart.products[i].productId.price*100
            };
            item.quantity=cart.products[i].quantity;
            itemId.productId = ObjectId(cart.products[i].productId._id);
            itemId.quantity = cart.products[i].quantity;
            itemIds.push(itemId);
            items.push(item);
        }

        const session = await stripe.checkout.sessions.create({
            customer_email: cart.user.email,
            payment_method_types: ['card'],
            line_items: items,
            mode: "payment",
            success_url: `${process.env.frontURL}ordersuccess`,
            cancel_url: `${process.env.frontURL}orderfailure`,
        });
        // stripe.confirmPayment(session.payment_intent).then(function(response) {
        //     if (response.error) {
        //       console.log(response.error,"nnnnnnnnnnnnnnnnnnnnnnnnn");
        //     } else if (response.paymentIntent && response.paymentIntent.status ) {
        //       console.log(response.paymentIntent.status,"bbbbbbbbbbbbbbbbbbbbb");
        //     }
        //   });
        // const {paymentIntent, error} = await stripe.retrievePaymentIntent(
        //     session.payment_intent
        //   );
        // stripe.retrievePaymentIntent(session.payment_intent).then((okay)=>{
        //     console.log(okay);
        // }).catch((err)=>{
        //     console.log(err);
        // });
        // console.log(paymentIntent);
        // console.log(session);
        let order={
            user: ObjectId(req.params.id),
            transactionId: session.id,
            amount: session.amount_total,
            item : itemIds
        }
        Order.create(order).then((okay)=>{
            // console.log("order",okay);
            res.json({url: session.url, sessionId: session.id});
        }).catch((err)=>{
            res.json({message:"some error in db"});
        });
        // const sessioncheck = await stripe.checkout.sessions.retrieve(session.id);
        // console.log("vvvvvvvvvvvvvv",sessioncheck);
        // res.json({url: session.url,});


    });




    // const session = await stripe.checkout.sessions.create({
    //     payment_method_types: ['card'],
    //     line_items: [
    //         {
    //             price_data: {
    //                 currency: "inr",
    //                 product_data: {
    //                     name: "check1",
    //                     images: ['check'],
    //                 },
    //                 unit_amount: 200 * 100,
    //             },
    //             quantity: 2,
    //         },
    //         {
    //             price_data: {
    //                 currency: "inr",
    //                 product_data: {
    //                     name: "check2",
    //                     images: ['check'],
    //                 },
    //                 unit_amount: 400 * 100,
    //             },
    //             quantity: 5,
    //         }
    //     ],
    //     mode: "payment",
    //     success_url: `https://www.google.com`,
    //     cancel_url: `https://www.instagram.com`,
    // });

    // res.redirect(303,session.url);
});



paymentRouter.post('/orderupdate/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt,async(req,res)=>{
    let sessionId=req.query.sessionId;
    const sessioncheck = await stripe.checkout.sessions.retrieve(sessionId);
    if(sessioncheck.payment_status==='paid'){
        Order.findOneAndUpdate({transactionId:sessionId},{'$set':{status:'Success'}}).then((okay)=>{
            Order.findOne({transactionId:sessionId}).then((order)=>{
                for(let i=0;i<order.item.length;i++){
                    Product.findByIdAndUpdate(order.item[i].productId,{'$inc':{quantity: -order.item[i].quantity}}).catch((err)=>{
                        res.status(400).send({message:"error in db"});
                    });
                }
            }).catch((err)=>{
                res.status(400).send({message:"error in db"});
            });
        }).catch((err)=>{
            res.status(400).send({message:"error in db"});
        });
        Cart.deleteOne({user: req.params.id}).catch((err)=>{
            res.status(400).send({message:"error in db"});
        });
        return res.status(200).send({message:"updated for success"});
    }else{
        Order.findOneAndUpdate({transactionId:sessionId},{'$set':{status:'Failure'}}).then((okay)=>{
            return res.status(200).send({message:"updated for failure"});
        }).catch((err)=>{
            return res.status(400).send({message:"error in db"});
        });
        
    }
});

module.exports = paymentRouter;
