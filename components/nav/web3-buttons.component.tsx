import { Flex } from "@chakra-ui/react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useQueryClient } from "@tanstack/react-query";

export default function Web3Buttons() {
  const queryClient = useQueryClient();

  return (
    <>
      <Flex gap="1rem">
      {!window?.xnft?.solana?.isXnft ? (
        <WalletMultiButton />
      ) : (
        <div>
        </div>
      )
      }
        {/* <WalletDisconnectButton /> */}
      </Flex>
    </>
  );
}
