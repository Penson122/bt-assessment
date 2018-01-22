const ParseError = require('./ParseError.js');
const Notification = Object.freeze({ HELLO: 'HELLO', LOST: 'LOST', FOUND: 'FOUND', UNKNOWN: 'UNKNOWN' });

class Node {
  /**
   * constructor - description
   *
   * @param  {type} name description
   * @returns {type}      description
   */
  constructor (name) {
    this.name = name;
    this.other = '';
  }

  /**
   * setAlive - description
   *
   * @param  {type} isAlive description
   * @returns {type}         description
   */
  setAlive (isAlive) {
    this.isAlive = isAlive;
  }

  /**
   * setTimeReceived - description
   *
   * @param  {type} time description
   * @returns {type}      description
   */
  setTimeReceived (time) {
    this.timeReceived = time;
  }

  /**
   * setReason - description
   *
   * @param  {type} who    description
   * @param  {type} reason description
   * @param  {type} other  description
   * @returns {type}        description
   */
  setReason (who, reason, other) {
    this.who = who;
    this.reason = reason;
    if (other) {
      this.other = other;
    }
  }

  /**
   * toString - description
   *
   * @returns {type}  description
   */
  toString () {
    // eslint-disable-next-line max-len
    return `${this.name} ${this.isAlive ? 'ALIVE' : 'DEAD'} ${this.timeReceived} ${this.who} ${this.reason} ${this.other}`;
  }
}

class NodeReport {
  /**
   * constructor - description
   *
   * @param  {type} report description
   * @returns {type}        description
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
