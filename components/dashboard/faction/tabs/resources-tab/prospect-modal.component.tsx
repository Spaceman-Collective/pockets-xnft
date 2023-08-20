import { BONK_MINT, RESOURCE_FIELD_CREATION_MULTIPLIER } from "@/constants";
import { useRfAllocate } from "@/hooks/useRf";
import { useSolana } from "@/hooks/useSolana";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  HStack,
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { FC, useEffect, useState } from "react";
import { BN } from "@coral-xyz/anchor";

type RFAccount = {
  harvest: any | null;
  id: string;
  initialClaimant: PublicKey | null;
  isHarvestable: boolean;
  refreshSeconds: BN | null;
  timesDeveloped: BN;
};

export const ModalRfProspect: FC<{
  isOpen: boolean;
  onClose: () => void;
  rf?: { rfCount: number; id: string };
}> = ({ isOpen, onClose, rf }) => {
  const {
    walletAddress,
    connection,
    signTransaction,
    buildTransferIx,
    encodeTransaction,
    buildProspectIx,
    getRFAccount,
  } = useSolana();

  const [rfAccount, setRfAccount] = useState<RFAccount>();
  console.log({ rf });

  useEffect(() => {
    const init = async () => {
      if (!rf?.id) return console.error("NO  ACCOUNT ID", rf);
      try {
        const account = await getRFAccount(connection, rf?.id);
        console.log({ account });
        setRfAccount(JSON.parse(JSON.stringify(account)) as RFAccount);
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, [rf?.id]);

  console.log({ rfAccount });

  const rfCount = typeof rf?.rfCount === "number" ? rf?.rfCount : 0;
  const bonkForNextField =
    (BigInt(rfCount) * RESOURCE_FIELD_CREATION_MULTIPLIER) / BigInt(1e5);

  const post = async () => {
    let ix =
      buildTransferIx &&
      buildTransferIx({
        walletAddress,
        mint: BONK_MINT.toString(),
        decimals: 5,
        amount: bonkForNextField * BigInt(1e5),
      });

    if (!ix) return;
    const encodedTx = await encodeTransaction({
      txInstructions: [ix],
      walletAddress,
      connection,
      signTransaction,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="blacks.500"
        p="2rem"
        borderRadius="1rem"
        minW="40vw"
        minH="40vh"
      >
        <ModalCloseButton display={{ base: "inline", md: "none" }} />
        <ModalBody>
          <Text>time to prospect</Text>
          <Button onClick={post}>Prospect</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
