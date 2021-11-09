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
var authenticate = require('../middleware/authenticate');


route.get('/sendotp',(req,res)=>{
    if(req.query.email){
        otpmethod.otpSend(req.query.email).then((okay)=>{
            return res.status(200).send({message:"otp sent"});
        }).catch((err)=>{
            return res.status(400).send(err);
        })
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


route.get("/test",(req,res)=>{
    
    if(req.query.otp){
        otpmethod.otpVerify('utkarsh19213@iiitd.ac.in',req.query.otp).then((okay)=>{
            return res.status(200).send({message:"otp verified"});
        }).catch((err)=>{
            return res.status(400).send(err);
        })
    }
    else{
        otpmethod.otpSend('utkarsh19213@iiitd.ac.in').then((okay)=>{
            return res.status(200).send({message:"send"});
        }).catch((err)=>{
            return res.status(400).send(err);
        })
    }
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
      .json({ error: "Employer already exist.Go and Sign In" });
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
  console.log(existingUser)
  const validPassword = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!validPassword) {
    return res.status(400).send("Invalid Password");
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


module.exports = route;
