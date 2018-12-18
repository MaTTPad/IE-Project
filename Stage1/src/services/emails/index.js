const nodemailer = require('nodemailer');
const config = require('../../config')

const gmailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mail.auth.user,
        pass: config.mail.auth.pass
    }
});

const transport=gmailTransport

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


module.exports = {sendmail}
