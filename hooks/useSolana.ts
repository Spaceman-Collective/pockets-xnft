declare global {
  interface Window {
    xnft: any;
  }
}
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { decode, encode } from "bs58";
import { SERVER_KEY, SPL_TOKENS, RESOURCES } from "@/constants";

type TxType = VersionedTransaction | Transaction;

export const useSolana = () => {
  const [payload, setPayload] = useState<{
    connection?: any;
    walletAddress?: string;
    signTransaction?: any;
  }>({
    connection: undefined,
    walletAddress: undefined,
    signTransaction: undefined,
  });

  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  useEffect(() => {
    const init = () => {
      if (window?.xnft?.solana?.isXnft) {
        const accountXnft = window.xnft.solana.publicKey?.toString();
        setPayload({
          connection: window.xnft.solana.connection,
          walletAddress: accountXnft,
          signTransaction: window.xnft.solana.signTransaction,
        });
      } else {
        setPayload({
          connection,
          walletAddress: publicKey?.toString(),
          signTransaction,
        });
      }
    };
    new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
      init();
    });
  }, [connection, publicKey, signTransaction]);

  return {
    ...payload,
    buildTransferIx,
    buildMemoIx,
    encodeTransaction,
    getBonkBalance,
  };
};

const buildMemoIx = ({
  walletAddress,
  payload,
}: {
  walletAddress: string;
  payload: any;
}) => {
  const TxInstruct = new TransactionInstruction({
    keys: [
      {
        pubkey: new PublicKey(walletAddress),
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
  decimals,
}: {
  walletAddress?: string;
  mint: string;
  amount: bigint;
  decimals: number;
}) => {
  if (!walletAddress) return;
  const senderATA = getAssociatedTokenAddressSync(
    new PublicKey(mint),
    new PublicKey(walletAddress),
  );
  const serverATA = getAssociatedTokenAddressSync(
    new PublicKey(mint),
    new PublicKey(SERVER_KEY),
  );
  const ix = createTransferCheckedInstruction(
    senderATA,
    new PublicKey(mint),
    serverATA,
    new PublicKey(walletAddress),
    amount,
    decimals,
  );
  return ix;
};

const encodeTransaction = async ({
  walletAddress,
  connection,
  signTransaction,
  txInstructions,
}: {
  walletAddress: string;
  connection: Connection;
  signTransaction: any;
  txInstructions: TransactionInstruction[];
}) => {
  const { blockhash } = await connection!.getLatestBlockhash();

  const txMsg = new TransactionMessage({
    payerKey: new PublicKey(walletAddress),
    recentBlockhash: blockhash,
    instructions: txInstructions,
  }).compileToLegacyMessage();

  const tx = new VersionedTransaction(txMsg);
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
  txInstructions: TransactionInstruction[];
}) => {
  let balance = await connection.getBalance(new PublicKey(walletAddress));
  console.info(`Wallet Balance: ${balance / LAMPORTS_PER_SOL}`);
  console.info(`Bonk Balance: ${balance / LAMPORTS_PER_SOL}`);

  // return currentBonkBalance;
};
