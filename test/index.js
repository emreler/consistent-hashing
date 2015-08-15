require('should');
var ConsistentHashing = require('../lib');

describe('Consistent Hashing', function () {
  var nodeNames = ['node1', 'node2', 'node3', 'node4', 'node5', 'node6'];
  var replicaCount = 100;

  var chars = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ];

  var cons;

  before(function () {
    cons = new ConsistentHashing(nodeNames,replicaCount);
  });

  it('should create nodes and their replicas', function (done) {
    // var cons = new ConsistentHashing(nodeNames, replicaCount);
    Object.keys(cons.nodes).should.containDeep(nodeNames);
    Object.keys(cons.ring).should.have.length(nodeNames.length*replicaCount);
    done();
  });

  it('should add nodes', function (done) {
    // var cons = new ConsistentHashing(nodeNames, replicaCount);
    cons.addNode('node7');

    cons.nodes.should.have.ownProperty('node7');
    done();
  });

  it('should store keys', function (done) {
    // var cons = new ConsistentHashing(nodeNames, replicaCount);
    chars.forEach(function(char) {
      cons.set(char, 'val-' + char);
    });

    done();
  });

  it('should remove nodes', function (done) {
    // var cons = new ConsistentHashing(nodeNames, replicaCount);
    cons.removeNode('node6');

    cons.nodes.should.not.have.ownProperty('node6');
    done();
  });

  it('should read keys', function (done) {
    chars.forEach(function (char) {
      cons.get(char).should.equal('val-' + char);
    });
    done();
  });
});
