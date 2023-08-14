declare global {
  interface Window {
    xnft: any;
  }
}

import type { Transaction, VersionedTransaction } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

type TxType = VersionedTransaction | Transaction;

export const useSolana = () => {
  const [payload, setPayload] = useState<{
    account?: string;
    signTransaction?: any;
  }>({
    account: undefined,
    signTransaction: undefined,
  });

  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  useEffect(() => {
    if (window?.xnft?.solana?.isXnft) {
      setPayload({
        account: window.xnft.solana.publicKey?.toString(),
        signTransaction: window.xnft.solana.signTransaction,
      });
    } else {
      setPayload({
        account: publicKey?.toString(),
        signTransaction,
      });
    }
  }, [publicKey]);

  return payload;
};
