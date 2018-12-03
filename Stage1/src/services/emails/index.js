const nodemailer = require('nodemailer');
const config = require('../../config')


// Remember to set: https://myaccount.google.com/lesssecureapps?pli=1
const gmailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mail.auth.user,
        pass: config.mail.auth.pass
    }
});

// https://nodemailer.com/smtp/testing/
const devTransport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.mail.auth.user, // generated ethereal user
        pass: config.mail.auth.pass  // generated ethereal password
    }
});


const transport = config.env === 'production' ? gmailTransport : devTransport


const sendmail = (to, subject, content) => {
    const mailOptions = {
        to,
        subject,
        html: content,
        from: config.mail.from,
    }

    transport.sendMail(mailOptions, (err, info) => {
        if(err)
            console.log(err)
        else
            console.log(info)
    })
}

module.exports = sendmail
