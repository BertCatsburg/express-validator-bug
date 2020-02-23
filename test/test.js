const superagent = require('superagent');
const superagentPrefix = require('superagent-prefix')('http://localhost:3011');
var debug = require('debug')('validatortest:test');

const goodObject = {
    a: 'aaa',
};
const badObject = {
    does_not_exist: 'aaa',
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