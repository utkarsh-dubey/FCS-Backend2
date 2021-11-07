const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');
let paymentRouter = require('./routes/payment.server.routes');
let addressRouter = require('./routes/address.server.routes');
let productRouter = require('./routes/product.server.routes');
let cartRouter = require('./routes/cart.server.routes');
const userRoutes = require('./routes/user.server.routes');



require('dotenv/config');
const port = 7000;
app.use(bodyParser.json());
app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  next()
})

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
