# Express Validator Test

This repo belongs to
 
[https://github.com/express-validator/express-validator/issues/839](https://github.com/express-validator/express-validator/issues/839)



It looks like there is a bug in checkschema.
 
The problem is that checkschema always gives an ok, 
even if you send it non-existent fields. 

Referring to page https://express-validator.github.io/docs/schema-validation.html
This is either incorrect or I'm missing something here.


The environment with the proof is created with standard 
Webstorm NodeJs/Express project generator. 
(And removed some unnecessary parts)


## package.json
Standard set of express packages and some extras like debug, 
mocha and superagent.

```
{
  "name": "validatortest",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "export DEBUG=validatortest:* && nodemon ./bin/www",
    "test": "export NODE_ENV=development && export DEBUG=validatortest:* && mocha --timeout 5000"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "^2.6.9",
    "express": "~4.16.1",
    "express-validator": "^6.4.0",
    "nodemon": "^2.0.2",
    "pug": "^2.0.4"
  },
  "devDependencies": {
    "mocha": "^7.0.1",
    "superagent": "^5.2.2",
    "superagent-prefix": "0.0.2"
  }
}
```
## app.js
A standard express app.js. Some things taken out. 

Only one Route to index.js

```
var express = require('express');
var cookieParser = require('cookie-parser');
var debug = require('debug')('validatortest:app');

var indexRouter = require('./routes/index');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
```
## routes/index.js
2 endpoints: 
- /test/body
    
    Does vlaidation with express-validator 'body'
    
- /test/checkschema
 
    Does vlaidation with express-validator 'checkschema'
    
Both do the same processingRequest: 
- Check for validation errors
- Either send 422 (Validation Error) or 200 (Ok) back to caller.

### code of index.js
```
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
```

## test/test.js
This does a simple Mocha test. 

With superagent it sends 4 POST requests.

- 2 Requests with a Good and Bad object to /test/body
- 2 Requests with a Good and Bad object to /test/checkschema

You would expect that checkschema gives also a 
422 (Validation Error) on the Bad object, 
but it does not do that. 

It gives a 200 (Ok) on all requests. This is not 
what is implied on https://express-validator.github.io/docs/schema-validation.html

It's also tested with plain fields (unlike this test with subdocuments). 
Also there all validation is gone through, even Bad Object. 

### Code for test/test.js
```
const superagent = require('superagent');
const superagentPrefix = require('superagent-prefix')('http://localhost:3011');
var debug = require('debug')('validatortest:test');

const goodObject = {
    b: {
        b1: 'bbb'
    }
};
const badObject = {
    where_is_b: 'not-here'
};

describe('Testing Express-Validator endpoint /test/checkschema', function () {

    it('should not give an error ', function (done) {
        superagent
            .post('/test/checkschema')
            .use(superagentPrefix)
            .send(goodObject)
            .end((err, res) => {
                if (res.status !== 200) {
                    throw('ERROR. Status should be 200 but is ' + res.status);
                }
                done();
            })
    });
    it('should give an error ', function (done) {
        superagent
            .post('/test/checkschema')
            .use(superagentPrefix)
            .send(badObject)
            .end((err, res) => {
                if (res.status !== 422) {
                    throw('ERROR. Status should be 422 but is ' + res.status);
                }
                done();
            })
    });
});


describe('Testing Express-Validator endpoint /test/body', function () {
    it('should not give an error ', function (done) {
        superagent
            .post('/test/body')
            .use(superagentPrefix)
            .send(goodObject)
            .end((err, res) => {
                if (res.status !== 200) {
                    throw('ERROR. Status should be 200 but is ' + res.status);
                }
                done();
            })
    });
    it('should give an error ', function (done) {
        superagent
            .post('/test/body')
            .use(superagentPrefix)
            .send(badObject)
            .end((err, res) => {
                if (res.status !== 422) {
                    throw('ERROR. Status should be 422 but is ' + res.status);
                }
                done();
            })
    });


});
```



 

