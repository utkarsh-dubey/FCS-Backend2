const express = require('express');
const productRouter = express.Router();
const mongoose = require('mongoose');
var passport = require('passport');
const cloudinary = require('./cloudinary');
//models
const User = require('../models/user');
const Product = require('../models/product');
const PDF = require('../models/pdfs');



productRouter.get("/",(req,res) =>{
    
    let query={};
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
            Product.create(product).then((product) => {
                res.status(200).send({message:"product created"});
            })
            .catch((err)=>{
                res.status(400).send({message:"some error while creating product"});
            })
            
        });
    });
});

productRouter.post('admin/approve/:id',(res,req) =>{
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

productRouter.post('admin/reject/:id',(res,req) =>{
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


productRouter.post('/imageupload',async(req,res)=>{
    try{
        let images=req.body.image;
        let url=[];
        // console.log(image);
        // console.log(req.body);
        for(const image of images){
            const uploadResponse = await cloudinary.uploader.upload(image,{upload_preset:'ml_default'});
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



module.exports = productRouter;