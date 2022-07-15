// ########## IMPORTS

// Module to keep secrets.
// Module to read and write files.
const fs = require('fs');

const batchJSON = fs.readFileSync('batches/usFedExec.json', 'utf8');
const batch = JSON.parse(batchJSON);
const {hosts} = batch;
hosts.sort((a, b) => a.what < b.what ? -1 : 1);
fs.writeFileSync('batches/usFedExecSorted.json', JSON.stringify(batch, null, 2));
