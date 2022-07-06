// ########## IMPORTS

// Module to keep secrets.
// Module to read and write files.
const fs = require('fs');

const smallJSON = fs.readFileSync('batches/a11yOrgsSmall.json', 'utf8');
const bigJSON = fs.readFileSync('batches/a11yOrgsBig.json', 'utf8');
const small = JSON.parse(smallJSON);
const big = JSON.parse(bigJSON);
const smallWhats = small.hosts.map(smallHost => smallHost.what);
big.hosts = big.hosts.filter(bigHost => ! smallWhats.includes(bigHost.what));
fs.writeFileSync('batches/a11yOrgsRest.json', JSON.stringify(big, null, 2));
