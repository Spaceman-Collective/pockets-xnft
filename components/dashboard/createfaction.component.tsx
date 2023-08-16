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
  useDisclosure,
} from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { useSolana } from "@/hooks/useSolana";
import { useCreateFaction } from "@/hooks/useCreateFaction";
import { timeout } from "@/lib/utils";
import { Faction } from "@/types/server/Faction";
import { SPL_TOKENS, FACTION_CREATION_MULTIPLIER } from "@/constants";
import { skip } from "node:test";
import { useFactionsInfo } from "@/hooks/useFactionsInfo";


export const CreateFaction = () => {
  const { handleSignTransaction, handleSignMemo, handleTransferSplInstruction, account, signTransaction, connection } = useSolana();
  console.log('connection: ', connection);
  console.log('account: ', account);
  const { data: numOfFactions } = useFactionsInfo();
  console.log(numOfFactions);
  const { mutate } = useCreateFaction();
  // const [isOpen, setIsOpen] = useState(false);
  const [faction, setFaction] = useState({
    name: "Test Faction",
    image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/mad_lads_pfp_1682211343777.png",
    external_link: "https://www.madlads.com/",
    description: "OG Madlads Test Faction",
  });

  // const closeModal = () => {
  //   setIsOpen(false);
  // };

  // const openModal = () => {
  //   setIsOpen(true);
  // };

  const handleCreateFaction = async () => {
    const payload = {
      mint: "CppHyx5oQ5vGGTEDk3ii5LtdzmAbdAffrqqip7AWWkdZ",
      timestamp: Date.now().toString(),
      faction,
    };
    console.log('total: ', numOfFactions?.total)
    console.log('fcm: ', FACTION_CREATION_MULTIPLIER)

    const ix = handleTransferSplInstruction({ account, mint: SPL_TOKENS.bonk.mint, amount: FACTION_CREATION_MULTIPLIER * BigInt(numOfFactions?.total), decimals: SPL_TOKENS.bonk.decimals });
    const encodedSignedTx = await handleSignTransaction({ account, connection, signTransaction, txInstructions: [handleSignMemo({ account, payload }), ix] });
    if (!encodedSignedTx) throw Error("No Tx");
    mutate({ signedTx: encodedSignedTx }, { onSuccess });
    // closeModal();
  };

  const [confetti, setConfetti] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()


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
        mt="2rem"
        bg={colors.brand.quaternary}
        borderRadius="0.5rem"
        p="1rem"
        width="40rem"
        fontSize="2rem"
        fontWeight={600}
        letterSpacing="1px"
        onClick={onOpen}
        cursor="pointer"
      >
        Create a Faction
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent 
              bg={colors.brand.primary}
              maxW="75rem"
          h="60rem"
          m="auto"
          p={10}
          display="flex"
          flexDirection="column"
          borderRadius="1rem">
          <ModalHeader fontSize="24px" fontWeight="bold" letterSpacing="3px">
            CREATE A FACTION
          </ModalHeader>
          <ModalCloseButton position="absolute" top="30px" right="30px" />
          <ModalBody flex="1">
            <Box w="100%" h="100%">
              <Text>Faction Name:</Text>
              <Text>Image:</Text>
              <Text>External Url:</Text>
              <Text>Description:</Text>
            </Box>

          </ModalBody>
          <ModalFooter>
            <Button
              w="100%"
              bg={colors.brand.quaternary}
              onClick={handleCreateFaction}
            >
              Create a Faction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
