/*
  urlCorrect
  Module to correct the URLs of a batch with a report from urlCheck.
  Arguments:
    0. Base of file name of batch.
    1. Prefix of reports created by urlCheck.
*/

// ########## IMPORTS

// Module to read and write files.
const fs = require('fs');

const batchJSON = fs.readFileSync(`batches/${process.argv[2]}.json`);
const batch = JSON.parse(batchJSON);
// For each host in the batch:
batch.hosts.forEach(host => {
  // Change the URL of the host to the actual URL in its urlCheck report.
  const reportJSON = fs.readFileSync(`reports/raw/${process.argv[3]}-${host.id}.json`);
  const report = JSON.parse(reportJSON);
  host.which = report.acts[1].result;
});
// Save the revised batch.
fs.writeFileSync(`batches/${process.argv[2]}Corrected.json`, JSON.stringify(batch, null, 2));
