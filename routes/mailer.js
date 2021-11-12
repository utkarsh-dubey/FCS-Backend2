// var aws = require('aws-sdk');
var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'fcsprojectotp@gmail.com',
        pass: 'Okay@12345',
    },
    secure: true,
});
const transporter1 = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'fcsprojectshare@gmail.com',
        pass: 'fcsshare',
    },
    secure: true,
});
// aws.config.update({
//     accessKeyId: config.AWS_ACCESS_KEY,
//     secretAccessKey: config.AWS_PRIVATE_KEY
// });
// const ses = new aws.SES({region: 'us-east-1'});

// console.log(ses);

function mailer(data) {
    return new Promise((resolve, reject) => {
        // const msg = {
        //     to: data.recv,
        //     from: 'fcsprojectotp@gmail.com',
        //     templateId: "d-350e30ce774b4e07a4ec766a63846aa1",
        //     dynamic_template_data: data.otp
        // };
        // sgMail.send(msg)
        //     .then(() => {
        //         resolve(true);
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //         reject(err);
        //         return;
        //     });

        const mailData = {
            from: 'fcsprojectotp@gmail.com',
            to: data.recv,
            subject: "OTP for verification",
            text: `OTP - ${data.otp}`
                // password - ${password}
                // please do not share and misplace your your email and passord with anyone`,
            // html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
           };
          
           transporter.sendMail(mailData, (error, info) => {
            if (error) {
             console.log("^^&^&^&")
             reject(error);
             return;
            }
            resolve(true);
            return;
           });

    })
}

function mailerShare(data) {
    return new Promise((resolve, reject) => {
        console.log(data);
        // const msg = {
        //     to: data.recv,
        //     from: 'fcsprojectotp@gmail.com',
        //     templateId: "d-7aa4cc24407b4c9a8442d2dbdd015dce",
        //     dynamic_template_data: data.sendingData
        // };
        // sgMail.send(msg)
        //     .then(() => {
        //         resolve(true);
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //         reject(err);
        //         return;
        //     });

        const mailData = {
            from: 'fcsprojectshare@gmail.com',
            to: data.recv,
            subject: "Your friend shared a product with you",
            text: `Your friend - ${data.sendingData.senderEmail} shared a product with you. Visit https://www.myonlineedu.in/${data.sendingData.link} to find out the product.`
                // password - ${password}
                // please do not share and misplace your your email and passord with anyone`,
            // html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
           };
          
           transporter1.sendMail(mailData, (error, info) => {
            if (error) {
             console.log("^^&^&^&")
             reject(error);
             return;
            }
            resolve(true);
            return;
           });

    })
}


// function sesSend(emailTo,otp){
    // const params= {
    //     Destination: {
    //         ToAddresses: [emailTo]
    //     },
    //     Message: {
    //         Body: {
    //             Text: {
    //                 Data: "OTP - "+ otp
    //             }
    //         },
    //         Subject: {
    //             Data: "OTP for verification"
    //         }
    //     },
    //     Source: 'fcsprojectotp@gmail.com'

    // };

    // return ses.sendEmail(params).promise();

    



// }




module.exports.mailer = mailer;
module.exports.mailerShare = mailerShare;
// module.exports.sesSend = sesSend;
// d-7aa4cc24407b4c9a8442d2dbdd015dce