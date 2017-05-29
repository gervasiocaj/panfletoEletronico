var moment = require('moment');

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

        if (eProperties.type === 'user defined') {
            errInfo.push(eProperties.message)
        // If we don't have a message for `type`, just push the error through
        } else if (!messages.hasOwnProperty(eProperties.type)) {
            errInfo.push("Erro '%s' não esperado'".format(eProperties.type));
        // Otherwise, use util.format to format the message, and passing the path
        } else {
            if (eProperties.type === 'required')
                errInfo.push(messages[eProperties.type].format(eProperties.path));
            else if (eProperties.type === 'unique')
                errInfo.push(messages[eProperties.type].format(eProperties.path, eProperties.value));
            else
                errInfo.push(messages[eProperties.type].format(eProperties.value, eProperties.path));
        }
    });
    return errInfo;
};

module.exports.resultError = function (err) {
    if (err.name === 'ValidationError')
        return {status: 'error', error: err.name, error_description: module.extractErrorInfo(err)};
    else
        return {status: 'error', error: err.name, error_description: err.message || 'Internal Server Error'};
};

module.exports.dateFormatter = function(date) {
    return moment(date).format('DD-MM-YYYY')
};

