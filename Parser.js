const fs = require('fs');
const path = require('path');

const ParseError = require('./ParseError.js');
const { Node, NodeReport, Notification } = require('./Node.js');

class Parser {
  /**
   * constructor - Create a new parser to read log files.
   *
   * @param  {string} path relative path to the log file.
   * @returns {Parser}     a new Parser object
   */
  constructor (path) {
    this.path = path;
    this.file = '';
  }

  /**
   * readFile - read in the loaded file synchronously, to set the file member for this class.
   *
   * @returns {undefined}
   */
  readFile () {
    try {
      this.file = fs.readFileSync(path.join(__dirname, this.path), 'utf8');
    } catch (e) {
      throw e;
    }
  }

  /**
   * convertToReports - Serialise the incoming log reports into manageable objects.
   *
   * @returns {NodeReport[]} NodeReports containing names, notification types, and lost or found nodes.
   */
  convertToReports () {
    if (this.file === '') {
      throw new ParseError('File is empty');
    }
    // strip newlines from file
    const file = this.file.split('\n').filter(e => e !== '');
    const reports = file.map(f => new NodeReport(f));
    return reports;
  }

  /**
   * @static parseReports - Convert an array of node reports into an array of Node objects to find alive or dead nodes.
   *
   * @param  {NodeReport[]} reports A serialised report of node logs
   * @returns {Node[]}              An array of Node objects containing their current status
   *                                - ALIVE/DEAD, last response time
   */
  static parseReports (reports) {
    return reports.reduce((nodes, r) => {
      const contains = nodes.find(n => n.name === r.name);
      if (r.lost) {
        const lostNode = nodes.find(n => n.name === r.lost);
        if (!lostNode) {
          const node = new Node(r.lost);
          node.setAlive(false);
          node.setTimeReceived(r.timeReceived);
          node.setReason(r.name, r.notification, r.lost);
          nodes.push(node);
          const updateNode = nodes.find(n => n.name === r.name);
          if (updateNode) {
            updateNode.setAlive(true);
            updateNode.setTimeReceived(r.timeReceived);
            updateNode.setReason(r.name, r.notification, r.lost);
          }
        }
      }
      if (r.found) {
        const foundNode = nodes.find(n => n.name === r.found);
        if (!foundNode) {
          const node = new Node(r.found);
          node.setAlive(true);
          node.setTimeReceived(r.timeReceived);
          node.setReason(r.name, r.notification, r.found);
          nodes.push(node);
          const updateNode = nodes.find(n => n.name === r.name);
          if (updateNode) {
            updateNode.setAlive(true);
            updateNode.setTimeReceived(r.timeReceived);
            updateNode.setReason(r.name, r.notification, r.lost);
          }
        }
      }
      if (!contains) {
        const node = new Node(r.name);
        nodes.push(node);
        node.setAlive(true);
        node.setTimeReceived(r.timeReceived);
        if (r.notification === Notification.HELLO) {
          node.setReason(r.name, r.notification);
        } else {
          node.setReason(r.name, r.notification, r.lost || r.found);
        }
      } else {
        contains.setAlive(true);
        contains.setTimeReceived(r.timeReceived);
      }
      return nodes;
    }, []);
  }
}

module.exports = Parser;
