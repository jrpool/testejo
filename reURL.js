// ########## IMPORTS

// Module to keep secrets.
// Module to read and write files.
const fs = require('fs');

const batchJSON = fs.readFileSync('batches/usFedExec.json');
const batch = JSON.parse(batchJSON);
batch.hosts.forEach(host => {
  const reportJSON = fs.readFileSync(`reports/raw/4aemv-${host.id}.json`);
  const report = JSON.parse(reportJSON);
  host.which = report.acts[1].result;
});
fs.writeFileSync('batches/usFedExecFixed.json', JSON.stringify(batch, null, 2));
