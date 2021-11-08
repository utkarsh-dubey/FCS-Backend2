
const express = require('express');
const pdfRouter = express.Router();
const mongoose = require('mongoose');

//models
const User = require('../models/user');
const Product = require('../models/product');
const PDF = require('../models/pdfs');








pdfRouter.post('/submitpdf/:id' ,(req,res) =>{
    User.findById(req.params.id).exec((err,user) =>{
        if(err){
            return res.status(400).send({message:"some error occured in db"});
        }
        if(!user.isSeller){
            return res.status(403).send({message:"you are not a seller"});
        }
        PDF.findById(pdfId).exec((err,pdf)=>{
            if(err){
                return res.status(400).send({message:"some error occured in db"});
            }
            if(!pdf.isApproved){
                return res.status(400).send({message:"this product is not approved by the admin"});
            }

            let product = req.body;
            Product.create(product).then((product) => {
                res.status(200).send({message:"product created"});
            })
            .catch((err)=>{
                res.status(400).send({message:"some error while creating product"});
            })
            
        });
    });
});




module.exports = pdfRouter;