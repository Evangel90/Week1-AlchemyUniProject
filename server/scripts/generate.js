const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak')

const privateKey = secp.utils.randomPrivateKey();

console.log('PrivateKey', toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);

console.log('PublicKey', toHex(publicKey));


