declare global {
  interface Window {
    xnft: any;
  }
}
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createTransferCheckedInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { encode } from "bs58";
import { SERVER_KEY, SPL_TOKENS, RESOURCES } from "@/constants";

type TxType = VersionedTransaction | Transaction;

export const useSolana = () => {
  // const [memoPayload, setMPayload] = useState<{
  //   account?: string;
  //   signTransaction?: any;
  //   handleSignTransaction?: any;
  // }>({
  //   account: undefined,
  //   signTransaction: undefined,
  //   handleSignTransaction: undefined,
  // });
  const [payload, setPayload] = useState<{
    account?: string;
    signTransaction?: any;
    handleSignTransaction: any,
    handleSignMemo?: any;
    handleTransferSplInstruction?: any;

  }>({
    account: undefined,
    signTransaction: undefined,
    handleSignTransaction: undefined,
    handleSignMemo: undefined,
    handleTransferSplInstruction: undefined,
  });

  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  useEffect(() => {
    if (window?.xnft?.solana?.isXnft) {
      const accountXnft = window.xnft.solana.publicKey?.toString();
      setPayload({
        account: accountXnft,
        signTransaction: window.xnft.solana.signTransaction,
        handleSignMemo: handleSignMemo,
        handleTransferSplInstruction: handleTransferSplInstruction,
        handleSignTransaction: handleSignTransaction
    });
    } else {
      setPayload({
        account: publicKey?.toString(),
        signTransaction,
        handleSignMemo: handleSignMemo,
        handleTransferSplInstruction: handleTransferSplInstruction,
        handleSignTransaction: handleSignTransaction
      });
    }
  }, [publicKey]);

  return payload;
};

const handleSignMemo = async ({
  account,
  payload
}: {
  account: string;
  payload: any;
}) => {

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

  return TxInstruct;
};

const handleTransferSplInstruction = ({
  account,
  mint,
  amount,
  decimals
}: {
  account: string,
  mint: string,
  amount: string
  decimals: number
}) => { 

  const senderATA = getAssociatedTokenAddressSync(new PublicKey(mint), new PublicKey(account));
  const serverATA = getAssociatedTokenAddressSync(new PublicKey(mint), new PublicKey(SERVER_KEY));
  
  const ix = createTransferCheckedInstruction(senderATA, new PublicKey(mint), serverATA, new PublicKey(account), BigInt(amount), decimals);

  return ix;
}

const handleSignTransaction = async ({
  account,
  connection,
  signTransaction,
  txInstructions
}: {
  account: string;
  connection: Connection;
  signTransaction: any;
  txInstructions: TransactionInstruction[]
}) => { 
  const { blockhash } = await connection?.getLatestBlockhash();
  const txMsg = new TransactionMessage({
    payerKey: new PublicKey(account),
    recentBlockhash: blockhash,
    instructions: txInstructions,
  }).compileToLegacyMessage();

  const tx = new VersionedTransaction(txMsg);

  const signedTx = await signTransaction(tx);

  const encodedSignedTx = encode(signedTx!.serialize());
  return encodedSignedTx;
};
