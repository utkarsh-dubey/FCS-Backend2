const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

function mailer(data) {
    return new Promise((resolve, reject) => {
        const msg = {
            to: data.recv,
            from: 'fcsprojectotp@gmail.com',
            templateId: "d-350e30ce774b4e07a4ec766a63846aa1",
            dynamic_template_data: data.otp
        };
        sgMail.send(msg)
            .then(() => {
                resolve(true);
            })
            .catch((err) => {
                console.error(err);
                reject(err);
                return;
            });
    })
}



module.exports = mailer;