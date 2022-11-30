import React, { useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import TransactionBox from "./TransactionBox";
import Transaction from "./Transaction";

export default function OrderViewer() {
  let stompClient;
  const [validTransactions, setValidTransactions] = useState([]);
  const [invalidTransactions, setInvalidTransactions] = useState([]);
  const [connected, setConnected] = useState(false);

  const connect = () => {
    let Sock = new SockJS("http://localhost:7079/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);

    console.log("CONNECTED");
  };

  const onConnected = () => {
    setConnected(true);
    stompClient.subscribe(`/payment/valid`, onValid, {});
    stompClient.subscribe(`/payment/invalid`, onInvalid, {});
  };

  const onError = (err) => {
    console.log(err);
    setConnected(false);
  };

  const onValid = (payload) => {
    var tr = JSON.parse(payload.body);
    validTransactions.push(tr);
    setValidTransactions([...validTransactions]);
    console.log("VALID");
  };

  const onInvalid = (payload) => {
    var tr = JSON.parse(payload.body);
    invalidTransactions.push(tr);
    setInvalidTransactions([...invalidTransactions]);
    console.log("INVALID");
  };
  useEffect(() => {
    if (!connected) {
      connect();
    }
  }, [connected]);

  return (
    <div>
      <div
        className={`transaction-box-left`}
        style={{ float: "left", width: "40%" }}
      >
        <table>
          <thead className="send-button">
            <tr>
              <th style={{ color: "green" }}>Valid Transactions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Transaction ID</th>
              <th>User Email</th>
              <th>Total Price</th>
              <th>Order ID</th>
            </tr>
            {validTransactions.map((t) => {
              return <Transaction id={t.id} key={t.id} transaction={t} />;
            })}
          </tbody>
        </table>
      </div>
      <div
        className={`transaction-box-right`}
        style={{ float: "right", width: "40%" }}
      >
        <table>
          <thead className="send-button">
            <tr>
              <th style={{ color: "green" }}>Invalid Transactions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Transaction ID</th>
              <th>User Email</th>
              <th>Total Price</th>
              <th>Order ID</th>
            </tr>
            {invalidTransactions.map((t) => {
              return <Transaction id={t.id} key={t.id} transaction={t} />;
            })}
          </tbody>
        </table>
      </div>
    </div>

    // <div>
    //   <TransactionBox
    //     key={"valid"}
    //     id={"valid"}
    //     list={validTransactions}
    //     theader={"Valid Transactions"}
    //     float="left"
    //   />
    //   <TransactionBox
    //     key={"invalid"}
    //     id={"invalid"}
    //     list={invalidTransactions}
    //     theader={"Invalid Transactions"}
    //     float="right"
    //   />
    // </div>
  );
}
