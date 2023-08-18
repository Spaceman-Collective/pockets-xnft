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
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { decode, encode } from "bs58";
import { SERVER_KEY, SPL_TOKENS, RESOURCES } from "@/constants";

type TxType = VersionedTransaction | Transaction;

export const useSolana = () => {
  const [payload, setPayload] = useState<{
    connection?: any,
    walletAddress?: string,
    signTransaction?: any,
    buildMemoIx?: any,
    buildTransferIx?: any,
    encodeTransaction: any,
    getBonkBalance: any
  }>({
    connection: undefined,
    walletAddress: undefined,
    signTransaction: undefined,
    buildMemoIx: undefined,
    buildTransferIx: undefined,
    encodeTransaction: undefined,
    getBonkBalance: undefined
  });

  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  useEffect(() => {

    const init = () => {
      if (window?.xnft?.solana?.isXnft) {  
        const accountXnft = window.xnft.solana.publicKey?.toString();
        console.log('in an xnft');
        setPayload({
          connection: window.xnft.solana.connection,
          walletAddress: accountXnft,
          signTransaction: window.xnft.solana.signTransaction,
          buildMemoIx: buildMemoIx,
          buildTransferIx: buildTransferIx,
          encodeTransaction: encodeTransaction,
          getBonkBalance: getBonkBalance
      });
      } else {
        setPayload({
          connection,
          walletAddress: publicKey?.toString(),
          signTransaction,
          buildMemoIx: buildMemoIx,
          buildTransferIx: buildTransferIx,
          encodeTransaction: encodeTransaction,
          getBonkBalance: getBonkBalance
        });
      }
    }
    new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
      init()
    })

  }, [connection, publicKey, signTransaction]);

  return payload;
};

const buildMemoIx = ({
  walletAddress,
  payload
}: {
  walletAddress: string;
  payload: any;
}) => {

  const TxInstruct = new TransactionInstruction({
    keys: [
      {
        pubkey:  new PublicKey(walletAddress),
        isSigner: true,
        isWritable: false,
      },
    ],
    data: Buffer.from(JSON.stringify(payload), "utf-8"),
    programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
  });

  return TxInstruct;
};

const buildTransferIx = ({
  walletAddress,
  mint,
  amount,
  decimals
}: {
  walletAddress: string,
  mint: string,
  amount: bigint,
  decimals: number
}) => { 
  const senderATA = getAssociatedTokenAddressSync(new PublicKey(mint), new PublicKey(walletAddress));
  const serverATA = getAssociatedTokenAddressSync(new PublicKey(mint), new PublicKey(SERVER_KEY));  
  console.log('amount: ', amount);
  const ix = createTransferCheckedInstruction(senderATA, new PublicKey(mint), serverATA, new PublicKey(walletAddress), amount, decimals);
  return ix;
}

const encodeTransaction = async ({
  walletAddress,
  connection,
  signTransaction,
  txInstructions
}: {
  walletAddress: string;
  connection: Connection;
  signTransaction: any;
  txInstructions: TransactionInstruction[]
}) => { 
  const { blockhash } = await connection!.getLatestBlockhash();
  console.log("Blockhash: ", blockhash);

  const txMsg = new TransactionMessage({
    payerKey: new PublicKey(walletAddress),
    recentBlockhash: blockhash,
    instructions: txInstructions,
  }).compileToLegacyMessage();

  const tx = new VersionedTransaction(txMsg);
  console.log("TX: ", tx);
  const signedTx = await signTransaction(tx);
  const encodedSignedTx = encode(signedTx!.serialize());

  return encodedSignedTx;
};

const getBonkBalance = async ({
  walletAddress,
  connection,
}: {
  walletAddress: string;
  connection: Connection;
  signTransaction: any;
  txInstructions: TransactionInstruction[]
}) => { 


  let balance = await connection.getBalance(new PublicKey(walletAddress));
  console.log(`Wallet Balance: ${balance/LAMPORTS_PER_SOL}`)

  console.log(`Bonk Balance: ${balance/LAMPORTS_PER_SOL}`)


  // return currentBonkBalance;
};
