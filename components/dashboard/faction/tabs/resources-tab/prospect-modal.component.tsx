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
  charMint?: string;
  factionId?: string;
}> = ({ isOpen, onClose, rf, charMint: characterMint, factionId }) => {
  const {
    walletAddress,
    connection,
    signTransaction,
    buildTransferIx,
    encodeTransaction,
    buildProspectIx,
    getRFAccount,
    sendTransaction,
  } = useSolana();

  const [rfAccount, setRfAccount] = useState<RFAccount>();
  console.log({ rf });

  useEffect(() => {
    console.log("LOOOP Account", rf);
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
  }, [rf, connection]);

  console.log({ rfAccount });

  const rfCount = typeof rf?.rfCount === "number" ? rf?.rfCount : 0;
  const bonkForNextField =
    (BigInt(rfCount) * RESOURCE_FIELD_CREATION_MULTIPLIER) / BigInt(1e5);

  const post = async () => {
    if (
      !signTransaction ||
      !characterMint ||
      !factionId ||
      !rf?.id ||
      !walletAddress
    )
      return;
    let ix =
      buildProspectIx &&
      (await buildProspectIx({
        walletAddress,
        characterMint,
        factionId,
        rfId: rf?.id,
      }));

    if (!ix || ix === undefined) return;
    const sig = await sendTransaction(
      connection,
      [ix],
      walletAddress,
      signTransaction,
    );

    console.log("#####################3", sig);
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
