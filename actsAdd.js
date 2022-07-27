/*
  actsAdd
  Module to merge acts from reports into other reports.
  Arguments:
    0. Subdirectory of reports/raw containing the original reports.
    1. Subdirectory of reports/raw containing the reports containing the new acts.
    2. Subdirectory of reports/raw to contain the revised reports.
*/

// ########## IMPORTS

// Module to read and write files.
const fs = require('fs');

// ########## FUNCTIONS

const getHost = fileName => fileName.replace(/^.+?-|\.json$/g, '');
const getMissing = (origFileNames, newFileNames) => {
  const origHosts = origFileNames.map(origName => getHost(origName));
  const newHosts = newFileNames.map(newName => getHost(newName));
  const missingOrig = origHosts.find(orig => ! newHosts.includes(orig));
  if (missingOrig) {
    return `original: ${missingOrig}`;
  }
  else {
    const missingNew = newHosts.find(newHost => ! origHosts.includes(newHost));
    if (missingNew) {
      return `adding: ${missingNew}`;
    }
    else {
      return '';
    }
  }
};

const origFileNames = fs.readdirSync(`reports/raw/${process.argv[2]}`);
const newFileNames = fs.readdirSync(`reports/raw/${process.argv[3]}`);
console.log(`Count of original reports: ${origFileNames.length}`);
console.log(`Count of adding reports: ${newFileNames.length}`);
const missing = getMissing(origFileNames, newFileNames);
if (missing) {
  console.log(`ERROR: Host missing, i.e. ${missing}`);
}
else {
  newFileNames.forEach(newName => {
    const newJSON = fs.readFileSync(`reports/raw/${process.argv[3]}/${newName}`, 'utf8');
    const origFileName = origFileNames.find(origName => getHost(origName) === getHost(newName));
    const origJSON = fs.readFileSync(`reports/raw/${process.argv[2]}/${origFileName}`, 'utf8');
    const newReport = JSON.parse(newJSON);
    const origReport = JSON.parse(origJSON);
    origReport.acts.push(... newReport.acts);
    origReport.testTimes.push(... newReport.testTimes);
    origReport.testTimes.sort((a, b) => b[1] - a[1]);
    [
      'logCount',
      'logSize',
      'errorLogCount',
      'errorLogSize',
      'prohibitedCount',
      'visitTimeoutCount',
      'visitRejectionCount',
      'elapsedSeconds'
    ].forEach(varName => {
      origReport[varName] += newReport[varName];
    });
    fs.writeFileSync(
      `reports/raw/${process.argv[4]}/${origFileName}`, JSON.stringify(origReport, null, 2)
    );
  });
}
