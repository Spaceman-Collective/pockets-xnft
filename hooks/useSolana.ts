declare global {
  interface Window {
    xnft: any;
  }
}

import type {
  Connection,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

type TxType = VersionedTransaction | Transaction;

export const useSolana = () => {
  const [connection, setConnection] = useState<Connection | undefined>();
  const [account, setAccount] = useState<string>();
  const [signTx, setSignTx] =
    useState<(transaction: TxType) => Promise<TxType>>();
  const [signAllTxs, setSignAllTxs] = useState<any>();

  const { connection: connectionRaw } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  useEffect(() => {
    if (window?.xnft?.solana?.isXnft) {
      setAccount(window.xnft.solana.publicKey?.toString());
      setSignTx(window.xnft.solana.signTransaction);
      // setConnection(window.xnft.solana.connection);
      // setSignAllTxs(window.xnft.solana.signAllTransactions);
    } else {
      setAccount(publicKey?.toString());
      setSignTx(signTransaction);
      // setConnection(connectionRaw);
      // setSignAllTxs(signAllTransactions);
    }
  }, [publicKey]);

  return {
    account,
    // connection,
    signTransaction: signTx,
    // signAllTransactions: signAllTxs,
  };
};
