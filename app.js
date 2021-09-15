
var speakeasy = require("speakeasy");
const secret = speakeasy.generateSecret({length: 20});
const express = require('express')
const app = express()
var QRCode = require('qrcode');
const port = 3000


QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
    console.log(data_url);

})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`, secret);
})