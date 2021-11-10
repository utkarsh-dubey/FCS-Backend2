const express = require('express');
const productRouter = express.Router();
const mongoose = require('mongoose');
var passport = require('passport');
const cloudinary = require('./cloudinary');
var multer = require('multer');
const otpGenerator = require('otp-generator');
var ObjectId = require('mongodb').ObjectId;
var upload = multer({dest:'../pdf'});
//models
const User = require('../models/user');
const Product = require('../models/product');
const PDF = require('../models/pdfs');



productRouter.get("/",(req,res) =>{
    
    let query={"isAllowed":true};
    if(req.query.search){
        let search=req.query.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        query={'$or' : [{'name' : {$regex :search, $options:'ix'}},{'category' :{$regex :search, $options:'ix'}}]};
    }
    
    Product.find(query).exec((err,products) => {

        if(err){
            return res.status(400).send({message:"some error occured in db"});
        }

        return res.status(200).send(products);

    });

});

productRouter.get('/:id',(req,res) => {
    Product.findById(req.params.id).exec((err,product) => {

        if(err){
            return res.status(400).send({message:"some error occured in db"});
        }

        return res.status(200).send(product);

    });
});

productRouter.post('/add/:id',(req,res) =>{
    let pdfId = req.query.pdfId;
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
            product.commission = 0.1*(product.price);
            product.sku = otpGenerator.generate(6,{digits:false});
            Product.create(product).then((product) => {
                PDF.findByIdAndUpdate(pdfId,{'$set':{isPublished:true}}).then((done)=>{
                    res.status(200).send({message:"product created"});
                }).catch((err)=>{
                    res.status(400).send({message:"some error while creating product"});
                })
                // res.status(200).send({message:"product created"});
            })
            .catch((err)=>{
                res.status(400).send({message:"some error while creating product"});
            })
            
        });
    });
});




productRouter.post('/imageupload',upload.any(),async(req,res)=>{
    try{
        // console.log(req);
        let images=req.files;
        let url=[];
        // console.log(image);
        // console.log(req.body);
        for(const image of images){
            const uploadResponse = await cloudinary.uploader.upload(image.path,{upload_preset:'ml_default'});
            // console.log(uploadResponse);
            url.push(uploadResponse.url);
        }
        return res.status(200).send({links:url});
    }
    catch(err){
        console.log(err);
        return res.status(400).send(err);
    }
});

productRouter.post('/pdfupload/:id',upload.single('pdf'),async(req,res)=>{
    try{
        User.findById(req.params.id).exec(async(err,user) =>{
            if(err){
                return res.status(400).send({message:"some error occured in db"});
            }
            if(!user.isSeller){
                return res.status(403).send({message:"you are not a seller"});
            }
            const pdf=req.file;
            console.log(pdf);
            // console.log(req);
            let url=[];
            // console.log(image);
            // console.log(req.body);
            // for(const image of images){
                const uploadResponse = await cloudinary.uploader.upload(pdf.path);
                // console.log(uploadResponse);
                // url.push(uploadResponse.url);
            // }
            PDF.create({sellerId:ObjectId(req.params.id),pdf:uploadResponse.url,name:pdf.originalname}).then((pdfRequest)=>{
                return res.status(200).send({pdf:pdfRequest});
            }).catch((err)=>{
                return res.status(400).send({message:"problem in db"});
            });
            
        });
    }
    catch(err){
        console.log(err);
        return res.status(400).send(err);
    }
});




module.exports = productRouter;