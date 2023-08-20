import { useSolana } from "@/hooks/useSolana";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
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
    buildProspectIx,
    getRFAccount,
    sendTransaction,
  } = useSolana();

  const [rfAccount, setRfAccount] = useState<RFAccount>();
  const [signed, setSigned] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      if (!rf?.id) return console.error("NO  ACCOUNT ID", rf);
      try {
        const account = await getRFAccount(connection, rf?.id);
        setRfAccount(JSON.parse(JSON.stringify(account)) as RFAccount);
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, [rf, connection]);

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

    //TODO: remove this log when building page
    console.info("SUCCESSFUL SIGN", sig);
    setSigned(sig ?? "");
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
          <Text>RF Account ID: {rfAccount?.id}</Text>
          <Text>time to prospect</Text>
          <Button onClick={post}>Prospect</Button>
          <Text>{signed}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
