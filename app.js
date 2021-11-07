const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
let paymentRouter = require('./routes/payment.server.routes');
let addressRouter = require('./routes/address.server.routes');
let productRouter = require('./routes/product.server.routes');
let cartRouter = require('./routes/cart.server.routes');
app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  next()
})
const userRoutes = require('./routes/userRoutes')



require('dotenv/config');
const app = express();
const port = 7000;
app.use(bodyParser.json());


app.use(bodyParser.json()); 

const connect = mongoose.connect(process.env.mongoUrl, { useNewUrlParser: true, keepAlive: true, useUnifiedTopology: true });
connect.then((db) => {
  console.log("Connected to db successful");
}, (err) => { console.log("Unable to connect to the db " + err); });


app.use('/payment', paymentRouter);
app.use('/cart',cartRouter);
app.use('/address',addressRouter);
app.use('/product',productRouter);
app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.use('/user', userRoutes);


app.listen(process.env.PORT || port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
