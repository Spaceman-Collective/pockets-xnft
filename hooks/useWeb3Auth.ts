import { useState, useEffect } from "react";
import { Web3Auth } from "@web3auth/modal";
import {
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  UserAuthInfo,
} from "@web3auth/base";
import RPC from "@/hooks/SolanaRPC";
import useLocalStorage from "use-local-storage";

export const useWeb3Auth = () => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [authIdToken, setAuthIdToken] = useState<UserAuthInfo | undefined>();
  const [account, setAccount] = useLocalStorage("account", "");

  useEffect(() => {
    const init = async () => {
      const web3 = new Web3Auth({
        clientId:
          "BL5FL1mFUvNRhURCu-Q2HaIxTNL4FeHoNv7489GHa4J6oTRt8hPjfZ8d6hXpk21vzN42LDjDKP-4R9TTA1ERUWc", // Get your Client ID from Web3Auth Dashboard
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x3", // 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
          rpcTarget: "https://api.devnet.solana.com", // pass on your own endpoint while creating an app
        },
      });
      setWeb3auth(web3);

      try {
        await web3.initModal();
        if (web3.provider) {
          setProvider(web3.provider);
          const rpc = new RPC(web3.provider);
          const address = await rpc.getAccounts();
          setAccount(address[0]);
        }
      } catch (err) {
        console.error("UH OH", err);
      }
    };
    init();
  }, []);

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    console.log("UICONSOLE:", args);
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);

    if (!web3authProvider) return;
    const rpc = new RPC(web3authProvider);
    const address = await rpc.getAccounts();
    if (!address) return;
    setAccount(address[0]);
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    setAuthIdToken(idToken);
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    return user;
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setAccount("");
    setProvider(null);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
    return address;
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
    return balance;
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole(privateKey);
  };

  const signTransaction = async (msg: string) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.signTransaction(msg);
    uiConsole(receipt);
    console.log({ receipt });

    //@ts-ignore
    if (receipt?.code === -32603) throw Error("no no no");
    return receipt;
  };

  return {
    account,
    web3auth,
    provider,
    authIdToken,
    login,
    logout,
    signTransaction,
    authenticateUser,
    getUserInfo,
    getAccounts,
    getBalance,
    sendTransaction,
    signMessage,
    getPrivateKey,
  };
};
