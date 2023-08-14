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

export const useSolana = () => {
  const [connection, setConnection] = useState<Connection | undefined>();
  const [account, setAccount] = useState<string>();
  const [signTx, setSignTx] =
    useState<
      (
        transaction: VersionedTransaction | Transaction
      ) => Promise<VersionedTransaction | Transaction>
    >();
  const [signAllTxs, setSignAllTxs] = useState<any>();

  const { connection: connectionRaw } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  useEffect(() => {
    console.log({ publicKey });
    if (false) {
      console.log("hello dev");
      setAccount(window.xnft.solana.publicKey?.toString());
      // setConnection(window.xnft.solana.connection);
      // setSignTx(window.xnft.solana.signTransaction);
      // setSignAllTxs(window.xnft.solana.signAllTransactions);
    } else {
      setAccount(publicKey?.toString());
      // setConnection(connectionRaw);
      // setSignTx(signTransaction);
      // setSignAllTxs(signAllTransactions);
    }
  }, [publicKey]);

  return {
    account,
    // connection,
    // signTransaction: signTx,
    // signAllTransactions: signAllTxs,
  };
};
