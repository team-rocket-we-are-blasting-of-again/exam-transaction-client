import React, { useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import TransactionBox from "./TransactionBox";
import TransactionPost from "./TransactionPost";

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
      <TransactionPost />
      <TransactionBox
        list={validTransactions}
        theader={"Valid Transactions"}
        float="left"
      />
      <TransactionBox
        list={invalidTransactions}
        theader={"Invalid Transactions"}
        float="right"
      />
    </div>
  );
}
