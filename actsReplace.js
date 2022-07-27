/*
  actsReplace
  Module to replace acts in each raw report with revised acts.
  Arguments:
    0. Subdirectory of reports/raw containing the original reports.
    1. Subdirectory of reports/raw containing the reports containing the revised acts.
    2. Subdirectory of reports/raw to contain the revised reports.
*/

// ########## IMPORTS

// Module to read and write files.
const fs = require('fs');

// ########## FUNCTIONS

const getHost = fileName => fileName.replace(/^.+?-|\.json$/g, '');
const getMissing = (origFileNames, revFileNames) => {
  const origHosts = origFileNames.map(origName => getHost(origName));
  const revHosts = revFileNames.map(revName => getHost(revName));
  const missingOrig = origHosts.find(orig => ! revHosts.includes(orig));
  if (missingOrig) {
    return `original: ${missingOrig}`;
  }
  else {
    const missingRev = revHosts.find(rev => ! origHosts.includes(rev));
    if (missingRev) {
      return `correcting: ${missingRev}`;
    }
    else {
      return '';
    }
  }
};

const origFileNames = fs.readdirSync(`reports/raw/${process.argv[2]}`);
const revFileNames = fs.readdirSync(`reports/raw/${process.argv[3]}`);
console.log(`Count of original reports: ${origFileNames.length}`);
console.log(`Count of correcting reports: ${revFileNames.length}`);
const missing = getMissing(origFileNames, revFileNames);
if (missing) {
  console.log(`ERROR: Host missing, i.e. ${missing}`);
}
else {
  revFileNames.forEach(revName => {
    const revJSON = fs.readFileSync(`reports/raw/${process.argv[3]}/${revName}`, 'utf8');
    const origFileName = origFileNames.find(origName => getHost(origName) === getHost(revName));
    const origJSON = fs.readFileSync(`reports/raw/${process.argv[2]}/${origFileName}`, 'utf8');
    const rev = JSON.parse(revJSON);
    const orig = JSON.parse(origJSON);
    const origActs = orig.acts;
    const revTests = rev.acts.filter(act => act.type === 'test');
    revTests.forEach(revTest => {
      const {which} = revTest;
      const origIndex = origActs
      .findIndex(origAct => origAct.type === 'test' && origAct.which === which);
      origActs[origIndex] = revTest;
    });
    fs.writeFileSync(
      `reports/raw/${process.argv[4]}/${origFileName}`, JSON.stringify(orig, null, 2)
    );
  });
}
