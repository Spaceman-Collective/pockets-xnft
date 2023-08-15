import { useState } from "react";
import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { useSolana } from "@/hooks/useSolana";
import { useCreateFaction } from "@/hooks/useCreateFaction";
import { timeout } from "@/lib/utils";
import { Faction } from "@/types/server/Faction";
import { SPL_TOKENS, FACTION_CREATION_MULTIPLIER } from "@/constants";
import { skip } from "node:test";


export const CreateFaction = () => {
  const { handleSignTransaction, handleSignMemo, handleTransferSplInstruction, account } = useSolana();

  const { numOfFactions } = useFactionsInfo();
  const { mutate } = useCreateFaction();
  const [isOpen, setIsOpen] = useState(false);
  const [faction, setFaction] = useState({
    name: "Test Faction",
    image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/mad_lads_pfp_1682211343777.png",
    external_link: "https://www.madlads.com/",
    description: "OG Madlads Test Faction",
  });

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleCreateFaction = async () => {
    // Your create faction logic here
  };

  const [confetti, setConfetti] = useState(false);

  const fireConfetti = async () => {
    if (confetti) return;
    setConfetti(true);
    await timeout(3600);
    setConfetti(false);
  };

  const onSuccess = (data: any) => {
    fireConfetti();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" cursor="pointer">
      <Button
        mt="1rem"
        bg={colors.brand.primary}
        borderRadius="0.5rem"
        p="0.5rem"
        fontSize="1.25rem"
        fontWeight={600}
        letterSpacing="1px"
        width="12rem"
        onClick={openModal}
      >
        Create a Faction
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal} size="xl">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={colors.brand.primary} maxW="600px" h="500px" m="auto" flex-direction="column">
          <ModalHeader fontSize="24px" fontWeight="bold" letterSpacing="3px">
            Create a Faction
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text>Name:</Text>
              {/* ... other input fields */}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              bg={colors.brand.quaternary}
              onClick={async () => {
                const payload = {
                  mint: "CppHyx5oQ5vGGTEDk3ii5LtdzmAbdAffrqqip7AWWkdZ",
                  timestamp: Date.now().toString(),
                  faction,
                };
                const encodedSignedTx = await handleSignTransaction([handleSignMemo(payload), handleTransferSplInstruction(account, SPL_TOKENS.bonk.mint, FACTION_CREATION_MULTIPLIER * numOfFactions(), SPL_TOKENS.bonk.decimals)]);
                if (!encodedSignedTx) throw Error("No Tx");
                mutate({ signedTx: encodedSignedTx }, { onSuccess });
                closeModal();
              }}
            >
              Create a Faction
            </Button>
            <Button bg={colors.brand.tertiary} ml={3} onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
function useFactionsInfo(): { numOfFactions: any; } {
    throw new Error("Function not implemented.");
}

