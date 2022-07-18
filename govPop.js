// ########## IMPORTS

// Module to keep secrets.
// Module to read and write files.
const fs = require('fs');

const batchJSON = fs.readFileSync('batches/usFedExec.json', 'utf8');
const batch = JSON.parse(batchJSON);
const popsFile = fs.readFileSync('govPop.txt', 'utf8');
const pops = popsFile.split(/\n/);
const batchDomains = batch.hosts.map(host => host.which.replace(/^https?:\/\/(?:www\.)?|\/$/g, ''));
const newPops = pops.filter(pop => ! batchDomains.includes(pop))
.sort()
.map(newPop => ({
  id: newPop.replace(/\..+/, ''),
  which: `https://${newPop}/`,
  what: ''
}));
fs.writeFileSync('batches/usFedExecPop.json', JSON.stringify(newPops, null, 2));
