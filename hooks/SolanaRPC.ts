import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { CustomChainConfig, SafeEventEmitterProvider } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";
import { encode } from "bs58";

export default class SolanaRpc {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  getAccounts = async (): Promise<string[]> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const acc = await solanaWallet.requestAccounts();

      return acc;
    } catch (error) {
      return error as string[];
    }
  };

  getBalance = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<CustomChainConfig>({
        method: "solana_provider_config",
        params: [],
      });
      const conn = new Connection(connectionConfig.rpcTarget);

      const accounts = await solanaWallet.requestAccounts();
      const balance = await conn.getBalance(new PublicKey(accounts[0]));

      return balance.toString();
    } catch (error) {
      return error as string;
    }
  };

  signMessage = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const msg = Buffer.from("Test Signing Message ", "utf-8");
      const res = await solanaWallet.signMessage(msg);

      return res.toString();
    } catch (error) {
      return error as string;
    }
  };

  sendTransaction = async (): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);

      const accounts = await solanaWallet.requestAccounts();

      const connectionConfig = await solanaWallet.request<CustomChainConfig>({
        method: "solana_provider_config",
        params: [],
      });
      const connection = new Connection(connectionConfig.rpcTarget);

      const block = await connection.getLatestBlockhash("finalized");

      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(accounts[0]),
        toPubkey: new PublicKey(accounts[0]),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });

      const transaction = new Transaction({
        blockhash: block.blockhash,
        lastValidBlockHeight: block.lastValidBlockHeight,
        feePayer: new PublicKey(accounts[0]),
      }).add(TransactionInstruction);

      const { signature } = await solanaWallet.signAndSendTransaction(
        transaction
      );

      return signature;
    } catch (error) {
      return error as string;
    }
  };

  signTransaction = async (messageToSign: string): Promise<string> => {
    try {
      const solanaWallet = new SolanaWallet(this.provider);
      const connectionConfig = await solanaWallet.request<CustomChainConfig>({
        method: "solana_provider_config",
        params: [],
      });
      const conn = new Connection(connectionConfig.rpcTarget);

      const pubKey = await solanaWallet.requestAccounts();
      const { blockhash } = await conn.getLatestBlockhash();

      const TxInstruct = new TransactionInstruction({
        keys: [
          {
            pubkey: new PublicKey(pubKey[0]),
            isSigner: true,
            isWritable: false,
          },
        ],
        data: Buffer.from(messageToSign, "utf-8"),
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      });

      const txMsg = new TransactionMessage({
        payerKey: new PublicKey(pubKey[0]),
        recentBlockhash: blockhash,
        instructions: [TxInstruct],
      }).compileToLegacyMessage();

      const tx = new VersionedTransaction(txMsg);

      const signedTx = await solanaWallet.signTransaction(tx);

      console.log(
        "sss",
        signedTx.message.compiledInstructions[0].data.toString()
      );
      const encodedSignedTx = encode(signedTx.serialize());
      // return signedTx.signature?.toString() || "";
      const newTx = Transaction.from(signedTx.serialize());
      console.log({ newTx }, newTx.instructions[0].data.toString());
      console.log(";aaaa", newTx.instructions[0].programId.toString());
      console.log(";TOWTWO", newTx.instructions[1].programId.toString());

      return encodedSignedTx;
    } catch (error) {
      console.error("error in signing", error);
      return error as string;
    }
  };

  getPrivateKey = async (): Promise<string> => {
    const privateKey = await this.provider.request({
      method: "solanaPrivateKey",
    });

    return privateKey as string;
  };
}
