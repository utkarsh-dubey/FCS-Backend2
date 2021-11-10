
const express = require('express');
const pdfRouter = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const authenticate = require('../middleware/authenticate');
//models
const User = require('../models/user');
const Product = require('../models/product');
const PDF = require('../models/pdfs');

pdfRouter.get('/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt,(req,res)=>{
    PDF.find({sellerId: req.params.id}).exec((err,pdfs)=>{
        if(err){
            return res.status(400).send({message:"some error in db"});
        }
        return res.status(200).send(pdfs);
    });
})

pdfRouter.post('/submitpdf/:id' ,passport.authenticate('jwt'),authenticate.matchIdandJwt,(req,res) =>{
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

pdfRouter.get('/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt,(req,res)=>{
    PDF.find({sellerId: req.params.id}).exec((err,pdfs)=>{
        if(err){
            return res.status(400).send({message:"some error in db"});
        }
        return res.status(200).send(pdfs);
    });
})

pdfRouter.get('/all/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt,(req,res)=>{
    User.findById(req.params.id).exec(async(err,user) =>{
        if(err){
            return res.status(400).send({message:"some error occured in db"});
        }
        if(!user.isAdmin){
            return res.status(403).send({message:"you are not an admin"});
        }
        PDF.find({}).exec((err,pdfs)=>{
            if(err){
                return res.status(400).send({message:"some error in db"});
            }
            return res.status(200).send(pdfs);
        });
    });
})



module.exports = pdfRouter;