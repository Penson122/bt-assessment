const { expect } = require('chai');
const { Node, NodeReport, Notification } = require('../Node');

const exampleReportStream = '1508405807242 1508405807141 vader HELLO';
const name = 'vader';

describe('Node tests', () => {
  describe('NodeReport', () => {
    it('Create NodeReport', () => {
      const report = new NodeReport(exampleReportStream);
      expect(report).to.be.an.instanceOf(NodeReport);
      const reportKeys = ['timeReceived', 'timeSent', 'name', 'notification'];
      expect(report).to.have.all.keys(...reportKeys);
    });
    it('Throws error with bad date, timeReceived', () => {
      expect(() => new NodeReport('foo bar baz')).to.throw('Invalid received time');
    });
    it('Throws error with bad date, timeSent', () => {
      expect(() => new NodeReport('1508405807242 bar baz')).to.throw('Invalid sent time');
    });
    it('Throws error with badly formatted fields', () => {
      expect(() => new NodeReport('1508405807242 1508405807141')).to.throw('Report has too few fields');
    });
    it('Throws error if report does not follow reporting standard', () => {
      expect(() => new NodeReport('1508405807242 1508405807141 TRAP'))
        .to.throw('Report should include a HELLO, LOST, or FOUND message');
    });
  });
  describe('Node', () => {
    it('Creates Node', () => {
      const node = new Node(name);
      expect(node).to.be.an.instanceOf(Node);
      expect(node.name).to.equal(name);
      expect(node.other).to.equal('');
    });
    it('setAlive', () => {
      const node = new Node(name);
      node.setAlive(true);
      expect(node.isAlive).to.be.true;
      node.setAlive(false);
      expect(node.isAlive).to.be.false;
    });
    it('setTimeReceived', () => {
      const node = new Node(name);
      node.setTimeReceived(1508405807560);
      expect(node.timeReceived).to.equal(1508405807560);
    });
    it('setReason', () => {
      const node = new Node(name);
      node.setReason(name, Notification.HELLO);
      expect(node.who).to.equal(name);
      expect(node.reason).to.equal(Notification.HELLO);
      expect(node.other).to.equal('');
    });
    it('setReason extended', () => {
      const node = new Node(name);
      node.setReason('luke', Notification.LOST, 'leia');
      expect(node.who).to.equal('luke');
      expect(node.reason).to.equal(Notification.LOST);
      expect(node.other).to.equal('leia');
    });
    it('toString ALIVE', () => {
      const node = new Node(name);
      node.setAlive(true);
      node.setTimeReceived(1508405807560);
      node.setReason(name, Notification.HELLO);
      expect(node.toString()).to.include('vader ALIVE 1508405807560 vader HELLO');
    });
    it('toString DEAD', () => {
      const node = new Node('leia');
      node.setAlive(false);
      node.setTimeReceived(1508405807468);
      node.setReason('luke', Notification.LOST, 'leia');
      expect(node.toString()).to.include('leia DEAD 1508405807468 luke LOST leia');
    });
  });
});
