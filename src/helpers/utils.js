var util = require('util'),
    moment = require('moment');

// Find the src path
var src = process.cwd() + '/src/';

var log = require(src + 'helpers/logging')(module);

module.exports.passwordValidator = function (password, passconf) {
    var message;

    if (password === '' || passconf === '') {
        message  = "O campo 'senha' e 'repita sua senha' são obrigatórios";
    }
    if (password !== passconf) {
        message  = 'As senhas devem ser iguais';
    }
    return message ? {error_description: message} : null
};

module.exports.extractErrorInfo = function (err) {
    if (err.name !== 'ValidationError')
        return [];

    var messages = {
        required: "O campo '%s' é obrigatório.",
        min   : "O valor '%s' esta abaixo do valor mímino permitido, para o campo '%s'.",
        max   : "O valor '%s' esta acima  do valor máximo permitido, para o campo '%s'.",
        enum  : "O valor '%s' não é um valor permitido, para o campo '%s'.",
        unique: "O campo '%s' deve ser unique. Entre com outro valor diferente de '%s'."
    };
    // A validation error can contain more than one error.
    var errInfo = [];

    // Loop over the errors object of the Validation Error
    Object.keys(err.errors).forEach(function (field) {
        var eObj = err.errors[field],
            eProperties = eObj.properties;

        // If we don't have a message for `type`, just push the error through
        if (!messages.hasOwnProperty(eProperties.type)) {
            // TODO(diegoadolfo): Get error message if exist
            errInfo.push(util.format("Erro '%s' não esperado'", eProperties.type));
        // Otherwise, use util.format to format the message, and passing the path
        } else {
            if (eProperties.type === 'required')
                errInfo.push(util.format(messages[eProperties.type], eProperties.path));
            else if (eProperties.type === 'unique')
                errInfo.push(util.format(messages[eProperties.type], eProperties.path, eProperties.value));
            else
                errInfo.push(util.format(messages[eProperties.type], eProperties.value, eProperties.path));
        }
    });
    return errInfo;
};

module.exports.dateFormatter = function(date) {
    return moment(date).format('DD-MM-YYYY')
};