// ########## IMPORTS

// Module to keep secrets.
// Module to read and write files.
const fs = require('fs');

const origNames = fs.readdirSync('reports/raw/a11yOrgsOrig');
const patchNames = fs.readdirSync('reports/raw/patches');
patchNames.forEach(patchName => {
  const patchJSON = fs.readFileSync(`reports/raw/patches/${patchName}`, 'utf8');
  const origName = origNames.find(origName => origName.slice(6) === patchName.slice(6));
  const origJSON =fs.readFileSync(`reports/raw/a11yOrgsOrig/${origName}`, 'utf8');
  const patch = JSON.parse(patchJSON);
  const orig = JSON.parse(origJSON);
  const origActs = orig.acts;
  const patchTests = patch.acts.filter(act => act.type === 'test');
  patchTests.forEach(patchTest => {
    const {which} = patchTest;
    const origIndex = origActs
    .findIndex(origAct => origAct.type === 'test' && origAct.which === which);
    origActs[origIndex] = patchTest;
  });
  fs.writeFileSync(`reports/raw/patched/${origName}`, JSON.stringify(orig, null, 2));
});
