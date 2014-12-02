
var assert = require('assert');
var sinon = require('sinon');

describe('AsyncEmitter', function() {
    var AsyncEmitter = require('./index');

    it('#emitParallel', function(done) {
        var d = new AsyncEmitter();
        var spy1 = sinon.spy(),
            spy2 = sinon.spy();

        d.on('foo', function(x, y, cb) {
            assert.equal(x, 1);
            assert.equal(y, 'bar');

            spy1();
            cb();
        });

        d.on('foo', function(x, y, cb) {
            assert.equal(x, 1);
            assert.equal(y, 'bar');

            spy2();
            cb();
        });


        d.emitParallel('foo', 1, 'bar', function() {
            assert(spy1.called, 'first listener was called');
            assert(spy2.called, 'second listener was called');

            done();
        });
    });

    it('#emitSeries', function(done) {
        var d = new AsyncEmitter();
        var spy1 = sinon.spy(),
            spy2 = sinon.spy();

        d.on('foo', function(x, y, cb) {
            assert.equal(x, 1);
            assert.equal(y, 'bar');

            setTimeout(function() {
                spy1();
                cb();
            }, 10);
        });

        d.on('foo', function(x, y, cb) {
            assert.equal(x, 1);
            assert.equal(y, 'bar');

            spy2();
            cb();
        });


        d.emitSeries('foo', 1, 'bar', function() {
            assert(spy1.called, 'first listener was called');
            assert(spy2.called, 'second listener was called');
            assert(spy2.calledAfter(spy1), 'second listener called after first');

            done();
        });
    });
});
