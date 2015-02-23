// #####################################################################################################################
// ################################################# I M P O R T S #####################################################
// #####################################################################################################################

var assert = require('assert');

// #####################################################################################################################
// ################################################### C L A S S #######################################################
// #####################################################################################################################

function PubSub () {
  /* @member {Object} _fns */
  this._fns = {};
  /* @member {Object} _regexpFns */
  this._regexpFns = {};
}

// #####################################################################################################################
// ################################################# M E T H O D S #####################################################
// #####################################################################################################################

/**
 * @method subscribe
 *
 * @desc Method to subscribe to a specific channel
 *
 * @param  {String}       channel
 * @param  {subscribeCb}  fn
 *
 */
PubSub.prototype.subscribe = function (channel, fn) {
  assert.equal(typeof(channel), 'string', "Channel must be a String");
  assert.equal(typeof(fn), 'function', "Callback associated must be a Function");

  if(this._fns[channel] === undefined) {
    this._fns[channel] = [fn];
  } else {
    this._fns[channel].push(fn);
  }
};
/**
 * @callback subscribeCb
 *
 * @desc Callback assigned to the Channel
 *
 * @param {String}  channel
 * @param {Mixed}   msg
 *
 */

// #####################################################################################################################

/**
 * @method unsubscribe
 *
 * @desc Method to unsubscribe either a specific function either all functions
 *
 * @param  {String}       channel
 * @param  {subscribeCb}  fn
 *
 */
PubSub.prototype.unsubscribe = function (channel, fn) {
  assert.equal(typeof(channel), 'string', "Channel must be a String");
  if(fn) {
    assert.equal(typeof(fn), 'function', "Callback to remove must be a Function");
  }

  if(this._fns[channel] !== undefined) {
    if(fn) {
      var index = this._fns[channel].indexOf(fn);
      this._fns[channel].splice(index, 1);
    } else {
      delete this._fns[channel];
    }
  }
};

// #####################################################################################################################

/**
 * @method regexpSubscribe
 *
 * @desc Method to subscribe to a regexp object reprensenting the channel
 *
 * @param {RegExp}      regexp
 * @param {subscribeCb} fn
 *
 */
PubSub.prototype.regexpSubscribe = function (regexp, fn) {
  assert.ok(regexp instanceof RegExp, "Channel must be a RegExp object");
  assert.equal(typeof(fn), 'function', "Callback associated must be a Function");

  var channel = regexp.toString();
  if(this._regexpFns[channel] === undefined) {
    this._regexpFns[channel] = {
      'regexp': regexp,
      'functions': [fn]
    };
  } else {
    this._regexpFns[channel].functions.push(fn);
  }
};

// #####################################################################################################################

/**
 * @method regexpUnsubscribe
 *
 * @desc Method to unsubscribe either a specific eiter all functions from a regexp object
 *
 * @param {RegExp}      regexp
 * @param {subscribeCb} fn
 *
 */
PubSub.prototype.regexpUnsubscribe = function (regexp, fn) {
  assert.ok(regexp instanceof RegExp, "Channel must be a RegExp object");
  if(fn) {
    assert.equal(typeof(fn), 'function', "Callback to remove must be a Function");
  }

  var channel = regexp.toString();
  if(this._regexpFns[channel] !== undefined) {
    if(fn) {
      var index = this._regexpFns[channel].functions.indexOf(fn);
      this._regexpFns[channel].functions.splice(index, 1);
    } else {
      delete this._regexpFns[channel];
    }
  }
};

// #####################################################################################################################

/**
 * @method publish
 *
 * @desc Method to publish a message on a channel
 *
 * @param  {String} channel
 * @param  {Mixed}  msg
 *
 */
PubSub.prototype.publish = function (channel, msg) {
  assert(typeof(channel), 'string', "Channel must be a String");

  // Check if channel is present in classic subscribings
  if(this._fns[channel] !== undefined) {
    this._fns[channel].forEach(function (elt) {
      elt(channel, msg);
    });
  }

  // Check if channel match regexp objects
  for(var r in this._regexpFns) {
    if(this._regexpFns[r].regexp.test(channel)) {
      for(var i = 0; i < this._regexpFns[r].functions.length; i++) {
        this._regexpFns[r].functions[i](channel, msg);
      }
    }
    this._regexpFns[r].regexp.lastIndex = 0;
  }
};

// #####################################################################################################################
// ################################################# E X P O R T S #####################################################
// #####################################################################################################################

module.exports = PubSub;
