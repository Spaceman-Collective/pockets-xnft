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
  SystemProgram,
} from "@solana/web3.js";
import { decode, encode } from "bs58";
import { SERVER_KEY, SPL_TOKENS, RESOURCES } from "@/constants";
import { PocketsProgram } from "../lib/program/pockets_program";
const pocketsIDL = require("../lib/program/pockets_program.json");
import { Program, AnchorProvider, Wallet, BN } from "@coral-xyz/anchor";
type TxType = VersionedTransaction | Transaction;

export const POCKETS_PROGRAM_PROGRAMID =
  "GEUwNbnu9jkRMY8GX5Ar4R11mX9vXR8UDFnKZMn5uWLJ";

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
    buildProspectIx,
    getRFAccount,
    sendTransaction,
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
  walletAddress?: string;
  connection: Connection;
  signTransaction?: any;
  txInstructions?: TransactionInstruction[];
}) => {
  if (!walletAddress || !txInstructions || !signTransaction) return;
  const { blockhash } = await connection!.getLatestBlockhash();

  const txMsg = new TransactionMessage({
    payerKey: new PublicKey(walletAddress),
    recentBlockhash: blockhash,
    instructions: txInstructions,
  }).compileToLegacyMessage();

  const tx = new VersionedTransaction(txMsg);
  if (!tx) return;
  const signedTx = await signTransaction(tx);
  const encodedSignedTx = encode(signedTx!.serialize());

  return encodedSignedTx;
};

const sendTransaction = async (
  connection: Connection,
  ixs: TransactionInstruction[],
  wallet: string,
  signTransaction: any,
) => {
  if (!wallet || !ixs || !signTransaction) return;
  const { blockhash } = await connection!.getLatestBlockhash();

  const txMsg = new TransactionMessage({
    payerKey: new PublicKey(wallet),
    recentBlockhash: blockhash,
    instructions: ixs,
  }).compileToLegacyMessage();

  const tx = new VersionedTransaction(txMsg);
  if (!tx) return;
  const signedTx = await signTransaction(tx);
  return await connection.sendRawTransaction(signedTx.serialize());
};

async function getTokenAccountBalance(
  wallet: string,
  solanaConnection: Connection,
  mint: string,
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
    { filters: filters },
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
    SPL_TOKENS.bonk.mint,
  );

  return bonkBalance;
};

const buildProspectIx = async ({
  walletAddress,
  characterMint,
  rfId,
  factionId,
}: {
  walletAddress?: string;
  characterMint: string;
  rfId: string;
  factionId: string;
}) => {
  if (!walletAddress) return;

  const walletAta = getAssociatedTokenAddressSync(
    new PublicKey(characterMint),
    new PublicKey(walletAddress),
  );

  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    { connection: new Connection("https://api.mainnet-beta.solana.com") },
  );

  const ix = await POCKETS_PROGRAM.methods
    .developResourceField()
    .accounts({
      wallet: new PublicKey(walletAddress),
      walletAta,
      systemProgram: SystemProgram.programId,
      citizen: getCitizenPDA(new PublicKey(characterMint)),
      rf: getRFPDA(rfId),
      faction: getFactionPDA(factionId),
    })
    .instruction();

  return ix;
};

function getCitizenPDA(characterMint: PublicKey): PublicKey {
  const [citizenPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("citizen"), Buffer.from(characterMint.toBuffer())],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID),
  );
  return citizenPDA;
}

function getFactionPDA(factionId: string): PublicKey {
  const [factionPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("faction"), Buffer.from(factionId)],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID),
  );
  return factionPDA;
}

function getRFPDA(rfId: string): PublicKey {
  const [rfPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("rf"), Buffer.from(rfId)],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID),
  );
  return rfPDA;
}

async function getRFAccount(connection: Connection, rfId: string) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    { connection },
  );

  return await POCKETS_PROGRAM.account.resourceField.fetch(getRFPDA(rfId));
}
