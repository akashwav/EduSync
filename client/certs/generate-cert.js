import { generate } from 'selfsigned';
import fs from 'fs';

const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = generate(attrs, { days: 365, keySize: 2048 });

if (!fs.existsSync('./certs')) fs.mkdirSync('./certs');

fs.writeFileSync('./certs/localhost.pem', pems.cert);
fs.writeFileSync('./certs/localhost-key.pem', pems.private);

console.log('✅ Self-signed certificates generated in ./certs');
