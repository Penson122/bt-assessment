const Parser = require('./Parser.js');
const path = process.argv[2] || 'input.txt';
if (!path) {
  console.error('Must supply relative file path to input file');
  process.exit(1);
}
const parser = new Parser(path);
let reports;
try {
  parser.readFile();
  reports = parser.convertToReports();
} catch (e) {
  console.error(e);
  process.exit(1);
}

const nodes = Parser.parseReports(reports);
nodes.map(n => console.log(n.toString()));
