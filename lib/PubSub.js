// #####################################################################################################################
// ################################################# I M P O R T S #####################################################
// #####################################################################################################################

var assert = require('assert');

// #####################################################################################################################
// ################################################### C L A S S #######################################################
// #####################################################################################################################

function PubSub () {
  this._fns = {};
  this._regexpFns = {};
}

// #####################################################################################################################
// ################################################# M E T H O D S #####################################################
// #####################################################################################################################

PubSub.prototype.subscribe = function (channel, fn) {
  assert.equal(typeof(channel), 'string', "Channel must be a String");
  assert.equal(typeof(fn), 'function', "Callback associated must be a Function");

  if(this._fns[channel] === undefined) {
    this._fns[channel] = [fn];
  } else {
    this._fns[channel].push(fn);
  }
};

// #####################################################################################################################

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
      this._regexpFns[r].functions.forEach(function (elt) {
        elt(channel, msg);
      });
    }
    this._regexpFns[r].regexp.lastIndex = 0;
  }
};

// #####################################################################################################################
// ################################################# E X P O R T S #####################################################
// #####################################################################################################################

module.exports = PubSub;
