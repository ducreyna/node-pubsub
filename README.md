# node-pubsub

Node module providing a simple and easy-to-use local Publish/Subscribe system.

## Installation

You can git clone this repo with the following methods:

- `git clone https://github.com/ducreyna/node-pubsub.git`

You can also add this project as a dependency in your nodejs project by editing the `package.json` file as follow:

```json
{
	"dependencies": {
		"pubsub": "https://github.com/ducreyna/node-pubsub.git"
	}
}
```

## How to use

```javascript
var PubSub = require('pubsub');
var pubsub = new PubSub();

var onPublish1 = function (channel, msg) {
	cconsole.log("Callback 1" + "\t" + channel + ": " + msg);
};

var onPublish2 = function (channel, msg) {
	console.log("Callback 2" + "\t" + channel + ": " + msg);
};

// Classic subscribe
pubsub.subscribe('myChannel', onPublish1);
pubsub.subscribe('myChannel', onPublish2);
pubsub.publish('myChannel', "Hello World !");
/* Console Out
Callback 1		myChannel: Hello World !
Callback 2		myChannel: Hello World !
*/

// Classic unsubscribe
pubsub.unsubscribe('myChannel', onPublish1);
pubsub.publish('myChannel', "Hello World !");
/* Console Out
Callback 2		myChannel: Hello World !
*/
pubsub.unsubscribe('myChannel'); // Unsubscribe all

// RegExp subscribe
var theRegexp = new RegExp('myChannel.*');
pubsub.regexpSubscribe(theRegexp, onPublish1);
pubsub.publish('myChannel', "Hello World !");
/* Console Out
Callback 1		myChannel: Hello World !
*/

// RegExp unsubscribe
pubsub.regexpUnsubscribe(theRegexp, onPublish1);
pubsub.publish('myChannel', "Hello World !");
/* Console Out
NOTHING
*/
```
