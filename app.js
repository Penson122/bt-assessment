const Parser = require('./Parser.js');

const parser = new Parser('input.txt');
parser.readFile();
let reports;

try {
  reports = parser.convertToReports();
} catch (e) {
  console.error(e);
}

const nodes = Parser.parseReports(reports);
nodes.map(n => console.log(n.toString()));
