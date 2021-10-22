const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const app = express();
const port = 7000;



const connect = mongoose.connect(process.env.mongoUrl, { useNewUrlParser: true, keepAlive: true, useUnifiedTopology: true });
connect.then((db) => {
  console.log("Connected to db successful");
}, (err) => { console.log("Unable to connect to the db " + err); });


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(process.env.PORT || port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
