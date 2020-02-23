var express = require('express');
var router = express.Router();
const {check, param, body, validationResult, checkSchema} = require('express-validator');
var debug = require('debug')('validatortest:index');


// Processing for all Routes
const processingRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({"status": "Validation Error"});
    } else {
        res.status(200).json({"status": "ok", "value of a": req.body.a});
    }
};

// Route to do validation with checkschema on 'b.b1'
router.post(
    '/test/checkschema',
    checkSchema({
        'b.b1' : {
            in: ['body'],
            optional: false,
            errorMessage: 'Property "b.b1" not found',
        }
    }),
    processingRequest,
);

// Route to do validation with body on 'b'
router.post(
    '/test/body',
    body('b')
        .notEmpty()
        .withMessage('Property "b" not found'),
    processingRequest,
);

module.exports = router;

