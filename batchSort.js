/*
  batchSort
  Module to sort the hosts of a batch.
  Arguments:
    0. Base of file name of batch.
*/

// ########## IMPORTS

// Module to read and write files.
const fs = require('fs');
// Sort the hosts by their names.
const batchJSON = fs.readFileSync(`batches/${process.argv[2]}.json`);
const batch = JSON.parse(batchJSON);
batch.hosts.sort((a, b) => a.what < b.what ? -1 : 1);
// Save the revised batch.
fs.writeFileSync(`batches/${process.argv[2]}Sorted.json`, JSON.stringify(batch, null, 2));
