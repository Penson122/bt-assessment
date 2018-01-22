class ParseError extends Error {
  /**
   * constructor - Used in throwing an erorr when parsing a log file
   *
   * @param  {string} message The error message to report to console
   * @returns {Error}         A new Error which can be thrown
   */
  constructor (message) {
    super(message);
    this.name = 'ParseError';
  };
}

module.exports = ParseError;
