# Consistent Hashing

This is a simple JavaScript implementation of consistent hashing. See the [Wiki page](https://en.wikipedia.org/wiki/Consistent_hashing) for more info on consistent hashing.

## Installation

Install dependencies using:

``` $ npm install ```
## Usage

```javascript
var ConsistentHashing = require('./consistent_hashing');

var nodeNames = ['node1', 'node2', 'node3', 'node4', 'node5', 'node6'];
var replicaCount = 100;

var cons = new ConsistentHashing(nodeNames, replicaCount);

var chars = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
  'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
  'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

chars.forEach(function(char) {
  cons.set(char, 'val-' + char);
});

console.log(cons.nodes);

cons.removeNode('node1');

console.log(cons.nodes);

```

You can run the example above using:

``` $ node example.js ```
## Test

Tests are written with Mocha. Run tests using:

``` $ mocha ```
