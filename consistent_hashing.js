'use strict';

var crypto = require('crypto');

var ConsistentHashing = function(nodeNames, replicaCount) {
  // todo: check if nodeNames is array and replicaCount is integer
  this.replicaCount = replicaCount;
  this.ring = {};
  this.nodes = {};
  var _this = this;
  nodeNames.forEach(function(nodeName) {
    _this.addNode(nodeName, replicaCount);
  });
};

ConsistentHashing.prototype.findClosestNode = function(key) {
  var pos = this.getPosition(this.getHash(key));
  var ringPositions = Object.keys(this.ring).map(function(f) {return parseFloat(f);}).sort();

  // Store the new (key, value) in the appropriate position on the ring
  var nodeName;
  for (var i = 0; i < ringPositions.length; i++) {
    var p = ringPositions[i];
    if (pos < p) {
      nodeName = this.ring[p];
      return nodeName;
    }
  }
};

ConsistentHashing.prototype.set = function(key, value) {
  var nodeName = this.findClosestNode(key);
  if (!nodeName) {
    throw new Error('Node not found.');
  }

  this.nodes[nodeName][key] = value;
};

ConsistentHashing.prototype.get = function(key) {
  var nodeName = this.findClosestNode(key);
  return this.nodes[nodeName][key];
};

ConsistentHashing.prototype.addNode = function(nodeName) {
  this.nodes[nodeName] = {};
  for (var i = 0; i < this.replicaCount; i++) {
    var key = nodeName + '-' + i;
    var pos = this.getPosition(this.getHash(key));
    this.ring[pos] = nodeName;
  }
};

ConsistentHashing.prototype.removeNode = function(nodeName) {
  // first, delete all replicas of node from the ring
  for (var i = 0; i < this.replicaCount; i++) {
    var key = nodeName + '-' + i;
    var pos = this.getPosition(this.getHash(key));

    if (!this.ring.hasOwnProperty(pos)) {
      throw new Error('Node replica does not exist.');
    }

    delete this.ring[pos];
  }

  // store node's existing (key, value) pairs on the ring again
  for (var k in this.nodes[nodeName]) {
    if (this.nodes[nodeName].hasOwnProperty(k)) {
      this.set(k, this.nodes[nodeName][k]);
    }
  }

  delete this.nodes[nodeName];
};

ConsistentHashing.prototype.getPosition = function(hash) {
  return (parseInt(hash, 16) % 10000000) / 10000000;
};

ConsistentHashing.prototype.getHash = function(key) {
  return crypto.createHash('sha1').update(key).digest('hex').substring(32);
};

module.exports = ConsistentHashing;
