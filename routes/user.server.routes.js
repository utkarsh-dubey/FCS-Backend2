const otpmethod = require('./otp');
const User = require("../models/user");
const express = require("express");
// const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
// const PostJob = require('../models/post-jobs')
// const Profile = require('../models/employer-profile')
const route = express.Router();
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const passport = require('passport');
const authenticate = require('../middleware/authenticate');
const Product = require('../models/product');

route.get('/sendotp',(req,res)=>{
    if(req.query.email){
        User.find({email:req.query.email}).exec((err,user)=>{
            if(err){
                return res.status(400).send({message:"problem in db"});
            }
            if(!(user.length===0)){
                return res.status(400).send({message: "can't proceed for signup, email already taken!"});
            }
            otpmethod.otpSend(req.query.email).then((okay)=>{
                return res.status(200).send({message:"otp sent"});
            }).catch((err)=>{
                return res.status(400).send(err);
            })
        });
        
    }
    else{
        res.status(400).send({message:"send email"})
    }
});

route.get('/verifyotp',(req,res)=>{
    if(req.query.otp && req.query.email){
        otpmethod.otpVerify(req.query.email,req.query.otp).then((okay)=>{
            return res.status(200).send({message:"otp verified"});
        }).catch((err)=>{
            return res.status(400).send(err);
        })
    }
    else{
        return res.status(400).send({message:"send proper queries"});
    }
})

route.post('/update/:id',(req,res)=>{
    let user={};
    user.firtName=req.body.firstName;
    user.lastName=req.body.lastName;
    user.gender=req.body.gender;
    user.phoneNumber=req.body.phoneNumber;

    User.findByIdAndUpdate(req.params.id,{'$set':req.body}).then((user)=>{
        return res.status(200).send({message:"user updated"});
    }).catch((err)=>{
        return res.status(400).send(err);
    });
});

route.get("/test",(req,res)=>{
    Product.updateMany({},{'$set':{'isAllowed':true}}).then((ok)=>{
        return res.status(200).send(ok);
    }).catch((err)=>{
        return res.status(400).send();
    });
});


route.post("/user/signup", async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array()[0].msg });
  // }


  console.log(req.body);
  console.log(req);

  const { firstName, email, password, lastName, gender } = req.body;
  let hashedPassword;
  try {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (error) {
    console.log("Password is not hashed");
    return res.status(400).send("Something Went Wrong Please Try Again Later");
  }

  const user = new User({
    firstName,
    email,
    password,
    lastName,
    gender,
    password: hashedPassword
  });

  let checkUser;

  try {
    checkUser = await User.findOne({ email });
  } catch (error) {
    //   console.log("ertyu")
    return res.status(400).send("something went wrong");
  }
  if (checkUser) {
    return res
      .status(400)
      .json({ error: "user already exist.Go and log In" });
  }
  try {
    await user.save();
    console.log("helloooooo");
  } catch (error) {
    console.log(error);
    const err = new Error("could not sign up try again");
    return next(err);
  }

  res.json({
    user: user._id,
  });
});

route.post('/user/login', async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array()[0].msg });
//   }
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return res.status(400).send("something went wrong");
  }
  if (!existingUser) {
    return res.status(400).send("Employer does not exist please sign up first");
  }
  if(!existingUser.isAllowed){
      return res.status(400).send("Can't login, banned by admin");
  }
  console.log(existingUser)
  const validPassword = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!validPassword) {
    return res.status(400).send("Invalid email passsword combination");
  }
  //creating token
  try {
    const token = authenticate.getToken({ _id: existingUser._id });
    res.header("auth_token", token).json({
      auth_token: token,
      user: existingUser,
    });
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send("something went fgh");
  }
});

route.get('/user/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt, async(req, res, next) => {
  const id = req.params.id;
  console.log(id)
  const existingUser = await User.findOne({ _id: id });
  res.json(existingUser);
})

route.post('/become/seller/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt, async(req, res, next) => {
  const id = req.params.id;
  console.log(id)
  const existingUser = await User.findOne({ _id: id });
  existingUser.GstNumber = req.body.gstNumber
  existingUser.PanNumber = req.body.panNumber
  existingUser.isSeller = req.body.isSeller
  // console.log(existingUser, "{{}}");
  await existingUser.save();
})

route.get('/get/users/:id',passport.authenticate('jwt'),authenticate.matchIdandJwt, async(req, res, next)=>{
    User.findById(req.params.id).exec(async(err,user) =>{
        if(err){
            return res.status(400).send({message:"some error occured in db"});
        }
        if(!user.isAdmin){
            return res.status(401).send({message:"you are not an admin"});
        }
        const users = await User.find({});
        console.log(users)
        res.json(users);
    });
})


module.exports = route;
