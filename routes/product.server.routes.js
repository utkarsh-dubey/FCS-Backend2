const express = require('express');
const productRouter = express.Router();
const mongoose = require('mongoose');

//models
const User = require('../models/user');
const Product = require('../models/product');


productRouter.get("/",(req,res) =>{

    Product.find({}).exec((err,products) => {

        if(err){
            return res.status(400).send({message:"some error occured in db"});
        }

        return res.status(200).send(products);

    });

});

productRouter.get('/:id',(req,res) => {
    
});






module.exports = productRouter;