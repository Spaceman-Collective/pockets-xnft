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
import { get } from "http";

type TxType = VersionedTransaction | Transaction;

export const useSolana = () => {
  const [payload, setPayload] = useState<{
    connection?: any;
    walletAddress?: string;
    signTransaction?: any;
    buildMemoIx?: any;
    buildTransferIx?: any;
    encodeTransaction: any;
    getBonkBalance: any;
  }>({
    connection: undefined,
    walletAddress: undefined,
    signTransaction: undefined,
    buildMemoIx: undefined,
    buildTransferIx: undefined,
    encodeTransaction: undefined,
    getBonkBalance: undefined,
  });

  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  useEffect(() => {
    const init = () => {
      if (window?.xnft?.solana?.isXnft) {
        const accountXnft = window.xnft.solana.publicKey?.toString();
        console.log("in an xnft");
        setPayload({
          connection: window.xnft.solana.connection,
          walletAddress: accountXnft,
          signTransaction: window.xnft.solana.signTransaction,
          buildMemoIx: buildMemoIx,
          buildTransferIx: buildTransferIx,
          encodeTransaction: encodeTransaction,
          getBonkBalance: getBonkBalance,
        });
      } else {
        setPayload({
          connection,
          walletAddress: publicKey?.toString(),
          signTransaction,
          buildMemoIx: buildMemoIx,
          buildTransferIx: buildTransferIx,
          encodeTransaction: encodeTransaction,
          getBonkBalance: getBonkBalance,
        });
      }
    };
    new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
      init();
    });
  }, [connection, publicKey, signTransaction]);

  return payload;
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
  walletAddress: string;
  mint: string;
  amount: bigint;
  decimals: number;
}) => {
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

async function getTokenAccountBalance(
  wallet: string,
  solanaConnection: Connection,
  mint: string
) {
  const filters: any[] = [
    {
      dataSize: 165, //size of account (bytes)
    },
    {
      memcmp: {
        offset: 32, //location of our query in the account (bytes)
        bytes: wallet, //our search criteria, a base58 encoded string
      },
    },
  ];

  const accounts = await solanaConnection.getParsedProgramAccounts(
    new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // TOKEN_PROGRAM_ID
    { filters: filters }
  );

  // console.log(
  //   `Found ${accounts.length} token account(s) for wallet ${wallet}.`
  // );

  let retTokenBalance: number = 0;
  accounts.forEach((account, i) => {
    //Parse the account data
    const parsedAccountInfo: any = account.account.data;
    const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
    const tokenBalance: number =
      parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

    //Log results
    // console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
    // console.log(`--Token Mint: ${mintAddress}`);
    // console.log(`--Token Balance: ${tokenBalance}`);

    if (mintAddress === mint) {
      retTokenBalance = tokenBalance;
    }
  });

  return retTokenBalance;
}

const getBonkBalance = async ({
  walletAddress,
  connection,
}: {
  walletAddress: string;
  connection: Connection;
}) => {
  const bonkBalance = await getTokenAccountBalance(
    walletAddress,
    connection,
    SPL_TOKENS.bonk.mint
  );

  return bonkBalance;
};
