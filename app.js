const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')
const bodyParser = require('body-parser');

require('dotenv/config');
const app = express();
const port = 7000;
app.use(bodyParser.json());



const connect = mongoose.connect(process.env.mongoUrl, { useNewUrlParser: true, keepAlive: true, useUnifiedTopology: true });
connect.then((db) => {
  console.log("Connected to db successful");
}, (err) => { console.log("Unable to connect to the db " + err); });


app.use('/api', userRoutes);

app.listen(process.env.PORT || port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
