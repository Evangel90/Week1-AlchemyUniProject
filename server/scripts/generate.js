const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak')

const privateKey = secp.utils.randomPrivateKey();

console.log('PrivateKey', toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);

console.log('PublicKey', toHex(publicKey));

const walletAddress = toHex(keccak256(publicKey)).slice(-20);

console.log('walletAddress', walletAddress);
