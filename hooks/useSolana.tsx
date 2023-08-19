declare global {
  interface Window {
    xnft: any;
  }
}
import { createContext, useContext, useEffect, useState } from "react";
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
import { ContextProvider } from "@/contexts/ContextProvider";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

type TxType = VersionedTransaction | Transaction;

export type SolanaContext = {
  connection?: Connection;
  walletAddress?: string;
  signTransaction?: any;
  buildMemoIx?: any;
  buildTransferIx?: any;
  encodeTransaction?: any;
  getBonkBalance?: any;
};

const defaultPayload: SolanaContext = {
  connection: undefined,
  walletAddress: undefined,
  signTransaction: undefined,
  buildMemoIx: undefined,
  buildTransferIx: undefined,
  encodeTransaction: undefined,
  getBonkBalance: undefined,
};

const SolanaContext = createContext<SolanaContext>(defaultPayload);

export const useSolana = () => {
  return useContext<SolanaContext>(SolanaContext);
};

// Returns true if the `window.xnft` object is ready to be used.
function useDidLaunch() {
  const [didConnect, setDidConnect] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.xnft) {
      // Set initial state based on connection status
      setDidConnect(!!window?.xnft?.connection);

      const onConnect = () => {
        console.log("connected to wallet");
        setDidConnect(true);
      };

      const onDisconnect = () => {
        console.log("disconnected from wallet");
        setDidConnect(false);
      };

      // Add event listeners
      window.xnft.on("connect", onConnect);
      window.xnft.on("disconnect", onDisconnect);

      // Cleanup: Remove event listeners when component unmounts
      return () => {
        window.xnft.off("connect", onConnect);
        window.xnft.off("disconnect", onDisconnect);
      };
    }
  }, []);

  return didConnect;
}

const BackpackProvider = ({ children }) => {
  const [payload, setPayload] = useState<SolanaContext>(defaultPayload);

  useEffect(() => {
    const accountXnft = window?.xnft?.solana.publicKey?.toString();
    setPayload({
      connection: window.xnft.solana.connection,
      walletAddress: accountXnft,
      signTransaction: window.xnft.solana.signTransaction,
      buildMemoIx: buildMemoIx,
      buildTransferIx: buildTransferIx,
      encodeTransaction: encodeTransaction,
      getBonkBalance: getBonkBalance,
    });
  }, []);

  return (
    <SolanaContext.Provider value={payload}>{children}</SolanaContext.Provider>
  );
};

const WebWalletProvider = ({ children }) => {
  const [payload, setPayload] = useState<SolanaContext>(defaultPayload);
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  useEffect(() => {
    setPayload({
      connection,
      walletAddress: publicKey?.toString(),
      signTransaction,
      buildMemoIx: buildMemoIx,
      buildTransferIx: buildTransferIx,
      encodeTransaction: encodeTransaction,
      getBonkBalance: getBonkBalance,
    });
  }, [connection, publicKey, signTransaction]);

  return (
    <SolanaContext.Provider value={payload}>{children}</SolanaContext.Provider>
  );
};

export const SolanaProvider = ({ children }) => {
  const [isInsideWallet, setInsideWallet] = useState(useDidLaunch());

  if (isInsideWallet) {
    return <BackpackProvider>{children}</BackpackProvider>;
  } else {
    return (
      <ContextProvider>
        <WalletModalProvider>
          <WebWalletProvider>{children}</WebWalletProvider>
        </WalletModalProvider>
      </ContextProvider>
    );
  }
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
  console.log("amount: ", amount);
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
  txInstructions: TransactionInstruction[];
}) => {
  let balance = await connection.getBalance(new PublicKey(walletAddress));
  console.log(`Wallet Balance: ${balance / LAMPORTS_PER_SOL}`);

  console.log(`Bonk Balance: ${balance / LAMPORTS_PER_SOL}`);

  // return currentBonkBalance;
};
