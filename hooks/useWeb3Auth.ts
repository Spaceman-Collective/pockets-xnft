import { useState, useEffect } from "react";
import { Web3Auth } from "@web3auth/modal";
import { SafeEventEmitterProvider } from "@web3auth/base";

export const useWeb3Auth = () => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    const init = async () => {
      const web3 = new Web3Auth({
        clientId:
          "BL5FL1mFUvNRhURCu-Q2HaIxTNL4FeHoNv7489GHa4J6oTRt8hPjfZ8d6hXpk21vzN42LDjDKP-4R9TTA1ERUWc", // Get your Client ID from Web3Auth Dashboard
        chainConfig: {
          chainNamespace: "solana",
          chainId: "0x1", // 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
          rpcTarget: "https://api.devnet.solana.com", // pass on your own endpoint while creating an app
        },
      });
      setWeb3auth(web3);

      try {
        await web3.initModal();
      } catch (err) {
        console.error("UH OH", err);
      }
    };
    init();
  }, []);

  return {
    web3auth,
    provider,
  };
};
