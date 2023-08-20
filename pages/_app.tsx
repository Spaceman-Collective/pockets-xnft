import "@/styles/global.css";
import { FC, useMemo } from "react";
import type { AppProps } from "next/app";
import { ChakraBaseProvider } from "@chakra-ui/react";
import { defaultTheme } from "@/styles/defaultTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Montserrat, Roboto } from "next/font/google";
import { Layout } from "@/components/layout";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// import { PhantomWalletAdapter, BackpackWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { ContextProvider } from "@/contexts/ContextProvider";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();
const headerFont = Roboto({ weight: ["400", "700"], subsets: ["latin"] });
const bodyFont = Montserrat({ weight: ["400", "700"], subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  // const network = WalletAdapterNetwork.Mainnet;
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // const endpoint = 'https://rpc.helius.xyz/?api-key=1b21b073-a222-47bb-8628-564145e58f4e';
  // const wallets = useMemo(
  //   () => [],
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [network]
  // );

  return (
    <>
      <style jsx global>
        {`
          html {
            --header: ${headerFont.style.fontFamily};
            --body: ${bodyFont.style.fontFamily};
          }
        `}
      </style>
      <ContextProvider>
        <WalletModalProvider>
          {/* APP */}
          <QueryClientProvider client={queryClient}>
            <ChakraBaseProvider theme={defaultTheme}>
              <main className={bodyFont.className}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
                <Toaster />
              </main>
            </ChakraBaseProvider>
          </QueryClientProvider>
          {/* APP */}
        </WalletModalProvider>
      </ContextProvider>
    </>
  );
}
