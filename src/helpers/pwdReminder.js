var Mailer = require('nodemailer'),
    EmailTemplate = require('email-templates').EmailTemplate;

// Find project working directory
var src = process.cwd() + '/src/';

var config = require(src + 'helpers/appConf');

var transporter = Mailer.createTransport(config.get('mail')),
    template    = new EmailTemplate(src + '../public/email_templates');

var sendPwdReminder = transporter.templateSender(template, {
    subject: 'Password Reminder',
    from   : config.get('smtpConfig:auth:user')
});

module.exports = {

    isRunning: function () {
        return transporter.verify();
    },
    sendPwdReminder: function (market, next) {
        sendPwdReminder({
                to: market.email
            }, {
                login: market.login,
                password: market.password
            },
            function(err, info) {
                next(err, info)
            });
    }
};
