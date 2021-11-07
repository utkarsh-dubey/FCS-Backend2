const express = require('express');
const addressRouter = express.Router();
const mongoose = require('mongoose');
//models
const User = require('../models/user');
const Address = require('../models/address');




module.exports = addressRouter;