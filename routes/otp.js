const otpGenerator = require('otp-generator');
const OTP = require('../models/otp');
var mailer1 = require('./mailer');
const mailer = mailer1.mailer;
function otpSend(email) {
    return new Promise((resolve, reject) => {
        let otpNum = otpGenerator.generate(6, { digits: true,alphabets: false, upperCase: false, specialChars: false });
        const mailData = {
            recv: email,
            otp: otpNum
        };
        console.log(mailData);
        mailer(mailData).then((value) => {

            OTP.create({email:email,otp:otpNum,createdOn:new Date()}).then((okay)=>{
                resolve(true);
            }).catch((err)=>{
                reject(err);
                return;
            })
        // mailer1.sesSend(email,otpNum).then((okay)=>{
        //     resolve(true);
        // }).catch((err)=>{
        //     reject(err);
        //     return;
        // });
            // res.statusCode = 200;
            // res.setHeader('Content-Type', 'application/json');
            // res.json({
            //     msg: 'Otp sent'
            // });
        });
            // .catch((err) => {
                // console.log(err);
                // res.statusCode = 400;
                // res.setHeader('Content-Type', 'application/json');
                // res.json({
                //     msg: 'otp send failed'
                // });
                // // });

            //     reject(err);
            //     return;

            // });

    });
}

function otpVerify(email,otpEntered){
    return new Promise((resolve,reject)=>{
        let time=new Date();
        // console.log(time);
        ((time).setTime(time.getTime()-(2*60*1000)));
        // console.log(time);
        OTP.find({email: email, createdOn:{'$gte':time}}).exec((err,otp)=>{
            if(err){
                reject(err);
                return;
            }
            if(otp.length===0){
                reject({message:"no otp found"});
                return;
            }
            let check=0;
            for(let i=0;i<otp.length;i++){
                if(otp[i].otp===otpEntered){
                    OTP.findOneAndRemove(otp[i]);
                    resolve(true);
                    return;
                }
                check+=1;
            }
            if(check===otp.length){
                reject({message:"wrong otp entered"});
                return;
            }

        })
    });
}



module.exports.otpSend = otpSend;
module.exports.otpVerify = otpVerify;
