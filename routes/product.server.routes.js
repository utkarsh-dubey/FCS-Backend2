const express = require('express');
const productRouter = express.Router();
const mongoose = require('mongoose');

//models
const User = require('../models/user');
const Product = require('../models/product');