const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x0478c11bbe74f47936dede04082ba69547087e29dd84c91a48095e01999524c5d37796e7dd337bb94c3da689408ab8ab73db5581c8ef2ed7af0bb66ebe82159c5c": 100,
  "0x04bd6a68741d7ded9c8b36d089f5012206a3255364b51e7bd1f0fd4306aa996e5a1570919293e8f1f74e96e448c719c294717d6356f5958d1c3149046f18d28e23": 50,
  "0x04f03d710d4748c5e4227c2237631b8b6482a6270ca50e4b5dc0a2b8314f7ce07fb89231a7d741a25f0dc87b553d03cc919954730d8364d58728ebe6c314afe5d0": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
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
