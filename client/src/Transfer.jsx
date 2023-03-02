import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [msgHash, setMsgHash] =useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function setTxHash() {
    try {
      const {
        data: { transactionCount },
      } = await server.get(`transactionCount/${address}`);
      const transactionObject = {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        nonce: transactionCount + 1,
      };
      // const transactionString = ;
      // setTransactionJSON(transactionString);
      // const transactionU8 = ;
      // const txHashU8 = ;
      console.log(transactionObject.nonce)
      const txHash = keccak256(utf8ToBytes(JSON.stringify(transactionObject)));

      setMsgHash(txHash);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  async function transfer(evt) {
    evt.preventDefault();

    // setnonce(nonce += 1);
    // console.log(nonce);

    // const msgHash = keccak256(utf8ToBytes(recipient + sendAmount));
    const signs = await secp.sign(msgHash, privateKey, {recovered: true} );
    const [signature, recoveryBit] = signs;

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
        recoveryBit
      });
      setBalance(balance);
      console.log(toHex(signature).slice(-20));
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" onClick={setTxHash}/>
    </form>
  );
}

export default Transfer;

