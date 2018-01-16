const chai = require('chai');
const expect = chai.expect;

describe('Reads files', () => {
  it('Can parse log files', () => {

  });
  it('Identifies malformed files - bad unix stamp', () => {

  });
  it('Identifies malformed files - times out of sync', () => {
    // time travel not supported
  });
  it('Identifies malformed files - fields missing', () => {

  });
  it('Identifies malformed files - invalid enum', () => {
    // Spec states that enum must be HELLO, LOST, FOUND
  });
});
