var multer = require('multer');

// Find project working directory
var src = process.cwd() + '/src/';

var config = require(src + 'helpers/appConf');

var fileUploader = multer({dest: src + '../public/uploads/',
    limits: {
        fields: 10,
        fieldSize: 2097152,
        files: 10,
        fileSize : 5242880
    },
    rename: function(fieldname, filename) {
        return filename;
    },
    onFileUploadStart: function(file) {
        if(config.get('images:mimetype').indexOf(file.mimetype) < 0) {
            return false;
        }
    },
    errorHandling: 'manual',
    inMemory: true
});

module.exports = fileUploader;