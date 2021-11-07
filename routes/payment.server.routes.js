const express = require('express');
const paymentRouter = express.Router();
const mongoose = require('mongoose');
const Stripe = require('stripe');
const stripe = Stripe("sk_test_51Jt7lhSEpQXgH7SXmbJv8iITVT1gYSvnoz2hznFjRtHIfVxfACOlNmzfeV3vJ9IoCd8Xa0oRihzZDn0itJbScbch00tiT2Kl0W");

//models
const User = require('../models/user');
const Cart = require('../models/cart');

console.log(stripe);
paymentRouter.get('/checkout',async(req,res) =>{
    // console.log("chalra");

    Cart.findOne({user: req.body.userId}).populate('user').populate('productId').exec(async(err,cart) =>{
        if(err){
            return res.status(404).send({message: "some db error occured"});
        }

        if(cart.products.length===0){
            return res.status(400).send({message: "nothing in cart to checkout"});
        }

        items=[];
        for(let i=0;i<cart.products.length;i++){
            item.price_data={
                currency: 'inr',
                product_data: {
                    name: cart.products[i].productId.name,
                    images: [cart.products[i].productId.images[0]]
                },
                unit_amount: cart.products[i].productId.price
            };
            item.quantity=cart.products[i].quantity;
            items.push(item);
        }

        const session = await stripe.checkout.sessions.create({
            customer_email: cart.user.email,
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "check1",
                            images: ['check'],
                        },
                        unit_amount: 200 * 100,
                    },
                    quantity: 2,
                },
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "check2",
                            images: ['check'],
                        },
                        unit_amount: 400 * 100,
                    },
                    quantity: 5,
                }
            ],
            mode: "payment",
            success_url: `${process.env.frontURL}ordersuccess`,
            cancel_url: `${process.env.frontURL}orderfailure`,
        });
    
        res.redirect(303,session.url);


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

module.exports = paymentRouter;
