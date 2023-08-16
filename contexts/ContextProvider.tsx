import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { FC, ReactNode, useCallback, useMemo, useEffect } from 'react';
import dynamic from "next/dynamic";
import { useSolana } from "@/hooks/useSolana";

const ReactUIWalletModalProviderDynamic = dynamic(
    async () =>
        (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
    { ssr: false }
);

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // const network = WalletAdapterNetwork.Mainnet;
    // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const endpoint = 'https://rpc.helius.xyz/?api-key=1b21b073-a222-47bb-8628-564145e58f4e';

    const wallets = useMemo(
        () => [
        ],
        []
    );

    const onError = useCallback(
        (error: WalletError) => {
            console.error('Wallet error: ' + error);
        },
        []
    );

    return (
        // TODO: updates needed for updating and referencing endpoint: wallet adapter rework

        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect>
                <ReactUIWalletModalProviderDynamic>
                    {children}
                </ReactUIWalletModalProviderDynamic>
            </WalletProvider>
        </ConnectionProvider>
    );
};