const express = require('express');
const adminRouter = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const authenticate = require('../middleware/authenticate');
const cloudinary = require('./cloudinary');
var multer = require('multer');
const otpGenerator = require('otp-generator');
var ObjectId = require('mongodb').ObjectId;
var upload = multer({dest:'../pdf'});
//models
const User = require('../models/user');
const Product = require('../models/product');
const PDF = require('../models/pdfs');


adminRouter.post('/approve/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt,(req,res) =>{
    let pdfId = req.query.pdfId;
    User.findById(req.params.id).exec((err,user) =>{
        if(err){
            return res.status(400).send({message:"some error occured in db"});
        }
        if(!user.isAdmin){
            return res.status(403).send({message:"you are not an admin, can't access this route"});
        }
        PDF.findByIdAndUpdate(pdfId,{isApproved:true}).exec((err,pdf)=>{
            if(err){
                return res.status(400).send({message:"some error occured in db"});
            }
            res.status(200).send({message:"approved"});
        });
    });
});

adminRouter.post('/reject/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt,(req,res) =>{
    let pdfId = req.query.pdfId;
    User.findById(req.params.id).exec((err,user) =>{
        if(err){
            return res.status(400).send({message:"some error occured in db"});
        }
        if(!user.isAdmin){
            return res.status(403).send({message:"you are not an admin, can't access this route"});
        }
        PDF.findByIdAndUpdate(pdfId,{isRejected:true}).exec((err,pdf)=>{
            if(err){
                return res.status(400).send({message:"some error occured in db"});
            }
            res.status(200).send({message:"rejected"});
        });
    });
});


adminRouter.post('/banuser/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt,(req,res)=>{
    let userId=req.query.user;
    User.findById(req.params.id).exec((err,user) =>{
        if(err){
            return res.status(400).send({message:"some error occured in db"});
        }
        if(!user.isAdmin){
            return res.status(403).send({message:"you are not an admin, can't access this route"});
        }
        User.updateOne({_id:userId},{'$set':{isAllowed:false}}).then((okay)=>{
            return res.status(200).send({message:"user banned"});
        }).catch((err)=>{
            return res.status(400).send({message:"some problem in db"});
        })
    });
});

adminRouter.post('/banproduct/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt,(req,res)=>{
    let productId=req.query.product;
    User.findById(req.params.id).exec((err,user) =>{
        if(err){
            return res.status(400).send({message:"some error occured in db"});
        }
        if(!user.isAdmin){
            return res.status(403).send({message:"you are not an admin, can't access this route"});
        }
        Product.updateOne({_id:productId},{'$set':{isAllowed:false}}).then((okay)=>{
            return res.status(200).send({message:"user banned"});
        }).catch((err)=>{
            return res.status(400).send({message:"some problem in db"});
        })
    });
});

adminRouter.post('/adduser/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt,(req,res)=>{
    let user=req.body;
    User.findById(req.params.id).exec((err,user) =>{
        if(err){
            return res.status(400).send({message:"some error occured in db"});
        }
        if(!user.isAdmin){
            return res.status(403).send({message:"you are not an admin, can't access this route"});
        }
        User.create(user).then((okay)=>{
            return res.status(200).send({message:"user added"});
        }).catch((err)=>{
            return res.status(400).send({message:"some problem in db"});
        })
    });
});


adminRouter.post('/addproduct/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt,(req,res)=>{
    let product=req.body;
    User.findById(req.params.id).exec((err,user) =>{
        if(err){
            return res.status(400).send({message:"some error occured in db"});
        }
        if(!user.isAdmin){
            return res.status(403).send({message:"you are not an admin, can't access this route"});
        }
        product.commission = 0.1*(product.price);
        product.sku = otpGenerator.generate(6,{digits:false});
        Product.create(product).then((product) => {
            res.status(200).send({message:"product created"});
        })
        .catch((err)=>{
            res.status(400).send({message:"some error while creating product"});
        });
    });
});






module.exports = adminRouter;