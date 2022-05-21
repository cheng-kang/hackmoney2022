import { makeApp } from './server';
import { Command } from 'commander';
import { ethers } from 'ethers';
import { ZksyncDatabase } from './zksync';
const program = new Command();
program
  .requiredOption(
    '-k --private-key <key>',
    'Private key to sign responses with. Prefix with @ to read from a file'
  )
  .requiredOption('-c --contract-address <string>', 'L2 Resolver Contract Address')
  .option('-t --ttl <number>', 'TTL for signatures', '300')
  .option('-p --port <number>', 'Port number to serve on', '8080');
program.parse(process.argv);
const options = program.opts();
let privateKey = options.privateKey;
const address = ethers.utils.computeAddress(privateKey);
const signer = new ethers.utils.SigningKey(privateKey);
const db = new ZksyncDatabase(options.contractAddress, options.ttl);
const app = makeApp(signer, '/', db);
console.log(`Serving on port ${options.port} with signing address ${address}`);
app.listen(parseInt(options.port));

module.exports = app;
