declare global {
  interface Window {
    xnft: any;
  }
}
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createTransferCheckedInstruction, createTransferInstruction, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { decode, encode } from "bs58";
import { SERVER_KEY, SPL_TOKENS, RESOURCES } from "@/constants";

type TxType = VersionedTransaction | Transaction;

export const useSolana = () => {
  const [payload, setPayload] = useState<{
    account?: string;
    signTransaction?: any;
    handleSignTransaction: any,
    handleSignMemo?: any;
    handleTransferSplInstruction?: any;
    connection?: any
  }>({
    account: undefined,
    signTransaction: undefined,
    handleSignTransaction: undefined,
    handleSignMemo: undefined,
    handleTransferSplInstruction: undefined,
    connection: undefined
  });

  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  useEffect(() => {

    const init = () => {
      if (window?.xnft?.solana?.isXnft) {  
        const accountXnft = window.xnft.solana.publicKey?.toString();
        console.log('in an xnft');
        setPayload({
          account: accountXnft,
          signTransaction: window.xnft.solana.signTransaction,
          handleSignMemo: handleSignMemo,
          handleTransferSplInstruction: handleTransferSplInstruction,
          handleSignTransaction: handleSignTransaction,
          connection: window.xnft.solana.connection
      });
      } else {
        setPayload({
          account: publicKey?.toString(),
          signTransaction,
          handleSignMemo: handleSignMemo,
          handleTransferSplInstruction: handleTransferSplInstruction,
          handleSignTransaction: handleSignTransaction,
          connection
        });
      }
    }
    new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
      init()
    })

  }, [connection, publicKey, signTransaction]);

  return payload;
};

const handleSignMemo = ({
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
  amount: bigint,
  decimals: number
}) => { 
  const senderATA = getAssociatedTokenAddressSync(new PublicKey(mint), new PublicKey(account));
  const serverATA = getAssociatedTokenAddressSync(new PublicKey(mint), new PublicKey(SERVER_KEY));  
  console.log('amount: ', amount);
  const ix = createTransferCheckedInstruction(senderATA, new PublicKey(mint), serverATA, new PublicKey(account), amount, decimals);
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
  const { blockhash } = await connection!.getLatestBlockhash();
  console.log("Blockhash: ", blockhash);

  const txMsg = new TransactionMessage({
    payerKey: new PublicKey(account),
    recentBlockhash: blockhash,
    instructions: txInstructions,
  }).compileToLegacyMessage();

  const tx = new VersionedTransaction(txMsg);
  console.log("TX: ", tx);
  const signedTx = await signTransaction(tx);
  const encodedSignedTx = encode(signedTx!.serialize());

  return encodedSignedTx;
};
