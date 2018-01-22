const ParseError = require('./ParseError.js');
const Notification = Object.freeze({ HELLO: 'HELLO', LOST: 'LOST', FOUND: 'FOUND', UNKNOWN: 'UNKNOWN' });

class Node {
  /**
   * constructor - Create a new node, used for converting to the console output format
   *
   * @param  {string} name The name of this node, vader, luke, etc
   * @returns {Node}       A new Node object
   */
  constructor (name) {
    this.name = name;
    this.other = '';
  }

  /**
   * setAlive - Set if this node is alive or not, changes report from ALIVE to DEAD, is determined if the node sends
   * HELLO or notifies on the status of another node
   *
   * @param  {bool} isAlive Is the node alive?
   * @returns {undefined}   no return
   */
  setAlive (isAlive) {
    this.isAlive = isAlive;
  }

  /**
   * setTimeReceived - Set the time of the last update to this node
   *
   * @param  {number} time The unix time stamp that the node was last updated
   * @returns {undefined}  no return
   */
  setTimeReceived (time) {
    this.timeReceived = time;
  }

  /**
   * setReason - Set what the last update this node reported, who and reason are required for all nodes such as
   * vader, HELLO or when a node reports on another node luke, LOST, leia.
   *
   * @param  {string} who          who created the updated
   * @param  {Notification} reason what the update was, HELLO, LOST, FOUND
   * @param  {string} other        the other node that the report informed about
   * @returns {undefined}          no return
   */
  setReason (who, reason, other) {
    this.who = who;
    this.reason = reason;
    if (other) {
      this.other = other;
    }
  }

  /**
   * toString - Create a human readable output for this node object
   *
   * @returns {string}  Human readable format such as: vader ALIVE 1508405807560 vader HELLO
   */
  toString () {
    // eslint-disable-next-line max-len
    return `${this.name} ${this.isAlive ? 'ALIVE' : 'DEAD'} ${this.timeReceived} ${this.who} ${this.reason} ${this.other}`;
  }
}

class NodeReport {
  /**
   * constructor - An object to store fields created by a reporting node
   *
   * @param  {string} report a line of the report output in the format
   *                         "timeReceived timeSent name notification other node"
   * @returns {NodeReport|ParseError} A new NodeReport object or a ParseError if the isn't enough
   *                                  information (missing name) or invalid unix time stamp.
   */
  constructor (report) {
    const elements = report.split(/\s+/);
    this.timeReceived = new Date(Number(elements[0])).getTime();
    this.timeSent = new Date(Number(elements[1])).getTime();
    this.name = elements[2];

    if (isNaN(this.timeReceived)) { throw new ParseError(`Invalid received time for ${report}`); }
    if (isNaN(this.timeSent)) { throw new ParseError(`Invalid sent time for ${report}`); }
    if (elements.length < 3) { throw new ParseError(`Report has too few fields \n ${report}`); }

    switch (elements[3]) {
      case Notification.HELLO:
        this.notification = Notification.HELLO;
        break;
      case Notification.LOST:
        this.notification = Notification.LOST;
        this.lost = elements[4];
        break;
      case Notification.FOUND:
        this.notification = Notification.FOUND;
        this.found = elements[4];
        break;
      default:
        throw new ParseError(`Report should include a HELLO, LOST, or FOUND message \n ${report}`);
    }
  }
}

module.exports = { Node, NodeReport, Notification };
