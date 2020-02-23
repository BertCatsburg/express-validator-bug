var express = require('express');
var router = express.Router();
const {check, param, body, validationResult, checkSchema} = require('express-validator');
var debug = require('debug')('validatortest:index');

router.post(
    '/test/checkschema',

    checkSchema({
        a: {
            in: ['body'],
            optional: false,
            errorMessage: 'Property "aa" not found'
        },
    }),

    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({"status": "Validation Error"});
        } else {
            res.status(200).json({"status": "ok", "value of a": req.body.a});
        }
    },
);


router.post(
    '/test/body',

    body('a')
        .isString()
        .notEmpty(),

    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({"status": "Validation Error"});
        } else {
            res.status(200).json({"status": "ok", "value of a": req.body.a});
        }
    },
);
module.exports = router;
