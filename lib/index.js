'use strict';

var crypto = require('crypto');

var ConsistentHashing = function(nodeNames, replicaCount) {
  // todo: check if nodeNames is array and replicaCount is integer
  this.replicaCount = replicaCount;
  this.ring = {};
  this.nodes = {};
  var _this = this;
  nodeNames.forEach(function(nodeName) {
    _this.nodes[nodeName] = {};
    _this.addNode(nodeName, replicaCount);
  });
};

ConsistentHashing.prototype.store = function(key, value) {
  var pos = this.getPosition(this.getHash(key));
  var ringPositions = Object.keys(this.ring).map(function(f) {return parseFloat(f);}).sort();

  // Store the new (key, value) in the appropriate position on the ring 
  for (var i = 0; i < ringPositions.length; i++) {
    var p = ringPositions[i];
    if (pos < p) {
      var nodeName = this.ring[p];
      this.nodes[nodeName][key] = value;
      break;
    }
  }
};

ConsistentHashing.prototype.addNode = function(nodeName) {
  for (var i = 0; i < this.replicaCount; i++) {
    var key = nodeName + '-' + i;
    var pos = this.getPosition(this.getHash(key));
    this.ring[pos] = nodeName;
  }
};

ConsistentHashing.prototype.getPosition = function(hash) {
  return (parseInt(hash, 16) % 1000) / 1000;
};

ConsistentHashing.prototype.getHash = function(key) {
  return crypto.createHash('sha1').update(key).digest('hex').substring(36);
};

module.exports = ConsistentHashing;
