var fs = require('fs');

// Find the src path
var src = process.cwd() + '/src/';

// Load Models
var utils = require(src + 'helpers/utils'),
    Image = require(src + 'panfleto/models/image'),
    Offer = require(src + 'panfleto/models/offer');

module.exports.view = function(req, res) {
    res.locals.success = req.flash();

    /* Render itemRegister page */
    res.render('itemRegister', {data : {}});
};

module.exports.create = function (req, res) {
    var item, image;
    var data = req.body;

    if (!data.type) {
        req.flash('message', "O tipo do item deve ser selecionado, escolha entre 'oferta' e 'promoção'");
        return res.redirect('/item');
    }
    if (data.type === 'offer') {
        delete data.type;
        item = new Offer(data);
    }

    if (req.file) {
        image = new Image({
            data: new Buffer(fs.readFileSync(req.file.path, 'base64'), 'base64'),
            size: req.file.size,
            encoding: 'base64',
            mimetype: req.file.mimetype
        });
        item.image = image;
        // item.markModified('image');
    }
    item.marketId = req.user;
    item.save()
        .then(function (item) {
            req.flash('message', 'Promoção ou Oferta registrada com sucesso!');
            return res.redirect('/item');
        })
        .catch(function (err) {
            Image.findByIdAndRemove(image._id, function (err) {
                if (err)
                    // TODO(diegoadolfo): create a service to fix this problem
                    log.warn("Cannot remove image by id " + image._id + " , it's will stay orphan in BD, please check this!");
            });
            req.flash('message', utils.extractErrorInfo(err));

            res.locals.error = req.flash();
            return res.render('itemRegister', { data: data })
        })
        .then(function () {
            fs.unlinkSync(req.file.path);
        })
};

module.exports.read = function (req, res) {
    res.type('text').send('Route not Implemented');
};
