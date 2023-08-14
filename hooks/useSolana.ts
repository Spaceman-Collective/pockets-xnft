declare global {
  interface Window {
    xnft: any;
  }
}

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { encode } from "bs58";

type TxType = VersionedTransaction | Transaction;

export const useSolana = () => {
  const [payload, setPayload] = useState<{
    account?: string;
    signTransaction?: any;
    handleSignTransaction?: any;
  }>({
    account: undefined,
    signTransaction: undefined,
    handleSignTransaction: undefined,
  });

  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  useEffect(() => {
    if (window?.xnft?.solana?.isXnft) {
      const accountXnft = window.xnft.solana.publicKey?.toString();
      setPayload({
        account: accountXnft,
        signTransaction: window.xnft.solana.signTransaction,
        handleSignTransaction: async (payload: any) => {
          if (!accountXnft || !connection) throw Error("not available");
          return await handleSignTransaction({
            account: window.xnft.solana.publicKey?.toString(),
            signTransaction: window.xnft.solana.signTransaction,
            connection,
            payload,
          });
        },
      });
    } else {
      setPayload({
        account: publicKey?.toString(),
        signTransaction,
        handleSignTransaction: async (
          payload: any
        ): Promise<string | undefined> => {
          if (!publicKey || !connection) throw Error("not available");
          return await handleSignTransaction({
            account: publicKey.toString(),
            signTransaction,
            connection,
            payload,
          });
        },
      });
    }
  }, [publicKey]);

  return payload;
};

const handleSignTransaction = async ({
  account,
  signTransaction,
  connection,
  payload,
}: {
  account: string;
  signTransaction: any;
  connection: Connection;
  payload: any;
}) => {
  if (!account || !signTransaction) return;
  const blockhashcontainer = await connection?.getLatestBlockhash();
  const blockhash = blockhashcontainer?.blockhash;
  const TxInstruct = new TransactionInstruction({
    keys: [
      {
        pubkey: new PublicKey(account),
        isSigner: true,
        isWritable: false,
      },
    ],
    data: Buffer.from(JSON.stringify(payload), "utf-8"),
    programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
  });

  const txMsg = new TransactionMessage({
    payerKey: new PublicKey(account),
    recentBlockhash: blockhash,
    instructions: [TxInstruct],
  }).compileToLegacyMessage();

  const tx = new VersionedTransaction(txMsg);
  if (!tx) return;

  const signedTx = await signTransaction(tx);

  const encodedSignedTx = encode(signedTx.serialize());
  return encodedSignedTx;
};
