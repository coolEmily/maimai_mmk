var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transport = nodemailer.createTransport(smtpTransport({
    host: 'smtp.yeah.net',
    secure: true,
    port: 465,
    auth: {
        user: 'maimaicn@yeah.net',
        pass: 'maimaicn0606'
    }
}));

var mailOptions = {
    from: 'maimaicn <maimaicn@yeah.net>',
    subject: 'server report'
};

transport.send = function(receiver,content){
    mailOptions.to = receiver;
    mailOptions.html = '<strong>' + content + '</strong>';
    transport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.error(error);
        } else {
            console.log(response);
        }
        transport.close();
    });
};


module.exports = transport;
