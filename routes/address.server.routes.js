const express = require('express');
const addressRouter = express.Router();
const mongoose = require('mongoose');
//models
const User = require('../models/user');
const Address = require('../models/address');
const passport = require('passport');
const authenticate = require('../middleware/authenticate');

addressRouter.get('/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt,(req,res)=>{
    Address.find({user: req.params.id}).exec((err, address)=>{
        if(err){
            return res.status(400).send({message:"some error in db"});
        }
        if(address.length===0){
            return res.status(200).send({noAddress: true});
        }
        return res.status(200).send({noAddress: false, address: address});
    });
});

addressRouter.post('/add/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt,(req,res)=>{
    Address.create(req.body).then((address)=>{
        User.findByIdAndUpdate(req.params.id,{"$addToSet":{"address":address._id}}).exec((err,user)=>{
            if(err){
                return res.status(400).send({message:"some error in db"});
            }
            return res.status(200).send({message:"added successfully"});
        })
    })
});



module.exports = addressRouter;