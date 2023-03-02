const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "7fbe2b8ec715347e01c8": 100, //80ae939c2f3194786c6be7e21471c7174cadeaa2433e274948cab20892dcdc13
  "bb8aa5446464b23b9dd9": 50, //1309a701deda81d8a395c663a4add4b68aa27f2d0309f944d8df3bdf866cd979
  "d99d0c64dad36c12c7d4": 75, //b38f27601a5502a81ad8a49cf92b080613982f73d78fba83b1e4898c8e6f0078
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async(req, res) => {
  const { sender, recipient, amount, signature, recoveryBit} = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  // const {signature, recoveryBit} = sign;
  // const sign = signature[0].toString();
  // const recoveryBit = signature[1].toString();
  const formattedSignature = Uint8Array.from(Object.values(signature));


  const msgToBytes = utf8ToBytes(recipient + amount);
  const msgHash = toHex(keccak256(msgToBytes));

  const publicKey = await secp.recoverPublicKey(msgHash, formattedSignature, recoveryBit);

  const verifyTx = secp.verify(formattedSignature, msgHash, publicKey)

  if (!verifyTx) {
    res.status(400).send({ message: "Invalid Transection" });
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  }else if (sender == recipient) {
    res.status(400).send({ message: "Please! Enter Another address" })
  }else if(recipient && amount) {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
