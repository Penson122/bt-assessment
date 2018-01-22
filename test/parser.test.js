const { expect } = require('chai');
const fs = require('fs');
const Parser = require('../Parser');
const { Node, NodeReport } = require('../Node');

const FILE_PATH = process.env.FILE_PATH || '/test/resources/exampleInput.txt';
const exampleOutput = fs.readFileSync('./test/resources/exampleOutput.txt', 'utf8');

const reportKeys = ['timeReceived', 'timeSent', 'notification', 'name'];
const nodeKeys = ['name', 'other', 'isAlive', 'timeReceived', 'who', 'reason'];

describe('Parser tests', () => {
  it('Can construct new parser', () => {
    const parser = new Parser(FILE_PATH);
    expect(parser).to.be.an.instanceOf(Parser);
    expect(parser.path).to.equal(FILE_PATH);
    expect(parser.file).to.equal('');
    expect(parser.file).to.have.length(0);
  });
  describe('Reads files', () => {
    it('Can open file', () => {
      const parser = new Parser(FILE_PATH);
      parser.readFile();
      expect(parser.file).to.be.a('string');
      expect(parser.file).to.have.length.above(1);
    });
    it('Throws error if there is nothing to read', () => {
      const parser = new Parser(FILE_PATH);
      expect(() => parser.convertToReports()).to.throw('File is empty');
    });
    it('Can create reports', () => {
      const parser = new Parser(FILE_PATH);
      parser.readFile();
      const reports = parser.convertToReports();
      reports.forEach(r => {
        expect(r).to.be.an.instanceOf(NodeReport);
        expect(r).to.include.all.keys(...reportKeys);
      });
    });
  });
  describe('Parses nodes', () => {
    it('Produces example output according to spec', () => {
      const parser = new Parser(FILE_PATH);
      parser.readFile();
      const reports = parser.convertToReports();
      const nodes = Parser.parseReports(reports);
      nodes.forEach(n => {
        expect(n).to.be.an.instanceOf(Node);
        expect(n).to.have.all.keys(...nodeKeys);
      });
      const nodeString = nodes.map(n => n.toString()).join('\n');
      expect(nodeString).to.be.a('string').and.to.equal(exampleOutput);
    });
    it('Parse nodes - new node with LOST', () => {
      const examplePath = './test/resources/exampleInputLost.txt';
      const exampleLostOutput = fs.readFileSync('./test/resources/exampleOutputLost.txt', 'utf8');
      const parser = new Parser(examplePath);
      parser.readFile();
      const reports = parser.convertToReports();
      const nodes = Parser.parseReports(reports);
      nodes.forEach(n => {
        expect(n).to.be.an.instanceOf(Node);
        expect(n).to.have.all.keys(...nodeKeys);
      });
      const nodeString = nodes.map(n => n.toString()).join('\n');
      expect(nodeString).to.be.a('string').and.to.equal(exampleLostOutput);
    });
    it('Parses nodes - new node with FOUND', () => {
      const examplePath = './test/resources/exampleInputFound.txt';
      const exampleFoundOutput = fs.readFileSync('./test/resources/exampleOutputFound.txt', 'utf8');
      const parser = new Parser(examplePath);
      parser.readFile();
      const reports = parser.convertToReports();
      const nodes = Parser.parseReports(reports);
      nodes.forEach(n => {
        expect(n).to.be.an.instanceOf(Node);
        expect(n).to.have.all.keys(...nodeKeys);
      });
      const nodeString = nodes.map(n => n.toString()).join('\n');
      expect(nodeString).to.be.a('string').and.to.equal(exampleFoundOutput);
    });
  });
});
