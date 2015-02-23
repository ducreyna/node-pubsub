var assert = require('assert');
var PubSub = require('../lib/PubSub.js');

var pubsub = new PubSub();

describe('Pubsub', function () {
  var theChannel = "myChannel";
  var theRegexp = new RegExp(theChannel);

  describe('Classic channels', function () {
    it('Subscribe bad params', function () {
      // Asserts
      assert.throws(
        function () {
          pubsub.subscribe(1, function () {})
        },
       /Channel must be a String/);

       assert.throws(
         function () {
           pubsub.subscribe(theChannel, true)
         },
        /Callback associated must be a Function/);
    });

    it('Subscribe', function (done) {
      var publishMsg = { 'key': "value" };

      pubsub.subscribe(theChannel, function (channel, msg) {
        // Asserts
        assert.strictEqual(channel, theChannel);
        assert.deepEqual(publishMsg, msg);
        done();
      });

      pubsub.publish(theChannel, publishMsg);
    });

    it('Subscribe multi callbacks', function () {
      pubsub.subscribe(theChannel, function () {});

      // Asserts
      assert.strictEqual(pubsub._fns[theChannel].length, 2);
    });

    it('Unsubscribe to a specific function', function () {
      pubsub.unsubscribe(theChannel, function () {});

      // Asserts
      assert.strictEqual(pubsub._fns[theChannel].length, 1);
    });

    it('Unsubscribe all', function () {
      pubsub.unsubscribe(theChannel);

      // Asserts
      assert.strictEqual(pubsub._fns[theChannel], undefined);
    });
  });

  describe('RegExp channels', function () {
    it('RegExp subscribe bad params', function () {
      // Asserts
      assert.throws(
        function () {
          pubsub.regexpSubscribe(theChannel, function () {})
        },
       /Channel must be a RegExp object/);

       assert.throws(
         function () {
           pubsub.regexpSubscribe(theRegexp, true)
         },
        /Callback associated must be a Function/);
    });

    it('RegExp subscribe', function (done) {
      var publishMsg = { 'key': "value" };

      pubsub.regexpSubscribe(theRegexp, function (channel, msg) {
        // Asserts
        assert.strictEqual(channel, theChannel);
        assert.deepEqual(publishMsg, msg);
        done();
      });

      pubsub.publish(theChannel, publishMsg);
    });

    it('RegExp subscribe multi callbacks', function () {
      pubsub.regexpSubscribe(theRegexp, function () {});

      // Asserts
      assert.strictEqual(pubsub._regexpFns[theRegexp.toString()].functions.length, 2);
    });

    it('RegExp unsubscribe specific function', function () {
      pubsub.regexpUnsubscribe(theRegexp, function () {});

      // Asserts
      assert.strictEqual(pubsub._regexpFns[theRegexp.toString()].functions.length, 1);
    });

    it('Unsubscribe all', function () {
      pubsub.regexpUnsubscribe(theRegexp);

      // Asserts
      assert.strictEqual(pubsub._regexpFns[theRegexp.toString()], undefined);
    });
  });
});
