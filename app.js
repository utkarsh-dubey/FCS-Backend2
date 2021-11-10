const express = require('express');
const mongoose = require('mongoose');
const app = express();
const rateLimit = require("express-rate-limit");
const bodyParser = require('body-parser');
let paymentRouter = require('./routes/payment.server.routes');
let addressRouter = require('./routes/address.server.routes');
let productRouter = require('./routes/product.server.routes');
let cartRouter = require('./routes/cart.server.routes');
const userRoutes = require('./routes/user.server.routes');
const pdfServerRoutes = require('./routes/pdf.server.routes');
const passport = require('passport');



require('dotenv/config');
const port = 7000;
app.use(bodyParser.json({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}));
// // app.use(
// //   cors({
// //     origin: ["http://localhost:3000", "https://checkout.stripe.com"],
// //   })
// // );

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 100 requests per windowMs
});

app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  next()
})

app.use(bodyParser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
})); 

const connect = mongoose.connect(process.env.mongoUrl, { useNewUrlParser: true, keepAlive: true, useUnifiedTopology: true });
connect.then((db) => {
  console.log("Connected to db successful");
}, (err) => { console.log("Unable to connect to the db " + err); });
app.use(limiter);
app.use(passport.initialize());
app.use('/payment', paymentRouter);
app.use('/cart',cartRouter);
app.use('/address',addressRouter);
app.use('/product',productRouter);
app.use('/pdf',pdfServerRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.use('/user', userRoutes);


app.listen(process.env.PORT || port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
