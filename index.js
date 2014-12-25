
var inherits = require('inherits');
var events = require('events');
var async = require('async');

function AsyncEmitter() {
    events.EventEmitter.call(this);
}
inherits(AsyncEmitter, events.EventEmitter);

AsyncEmitter.prototype._emitAsync = function(series, type, args, done) {
    var listeners = this.listeners(type);
    var asyncArgs = [listeners].concat(args).concat(done);

    var method = series ? async.applyEachSeries : async.applyEach;

    method.apply(async, asyncArgs);
};

/**
 * Call listeners in parallel
 * @param {String} type
 * @param {...*} args
 * @param {function} callback
 */
AsyncEmitter.prototype.emitParallel = function(type) {
    var args = [].slice.call(arguments, 1);
    var done = args.pop();

    this._emitAsync(false, type, args, done);
};

/**
 * Call listeners in series
 * @param {String} type
 * @param {...*} args
 * @param {function} callback
 */
AsyncEmitter.prototype.emitSeries = function(type) {
    var args = [].slice.call(arguments, 1);
    var done = args.pop();

    this._emitAsync(true, type, args, done);
};

module.exports = AsyncEmitter;
