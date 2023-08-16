import { FC, useState } from "react";
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


export const CreateFaction: FC<{
  fire: () => void;
}> = ({fire: fireConfetti}) => {
  const { connection, account, signTransaction, buildMemoIx, buildTransferIx, encodeTransaction } = useSolana();
  console.log('connection: ', connection);
  console.log('account: ', account);
  const { data: numOfFactions } = useFactionsInfo();
  console.log(numOfFactions);
  const { mutate } = useCreateFaction();

  const [faction, setFaction] = useState({
    name: "Test Faction",
    image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/mad_lads_pfp_1682211343777.png",
    external_link: "https://www.madlads.com/",
    description: "OG Madlads Test Faction",
  });

  const { isOpen, onOpen, onClose } = useDisclosure()



  const onSuccess = (data: any) => {
    fireConfetti();
    onClose();
  };

  const handleCreateFaction = async () => {
    const payload = {
      mint: "CppHyx5oQ5vGGTEDk3ii5LtdzmAbdAffrqqip7AWWkdZ",
      timestamp: Date.now().toString(),
      faction,
    };

    const totalFactions = numOfFactions?.total;
    const requiredBONK = FACTION_CREATION_MULTIPLIER * BigInt(numOfFactions?.total);
    const bonkMint = SPL_TOKENS.bonk.mint;
    const dcms = SPL_TOKENS.bonk.decimals;
    console.log(`Total Factions: ${totalFactions} Required Bonk ${requiredBONK}  Bonk Mint ${bonkMint}  Decimals ${dcms}` );

    const ix = await buildTransferIx({ account, mint: bonkMint, amount: requiredBONK, decimals: dcms});
    const encodedSignedTx = await encodeTransaction({ account, connection, signTransaction, txInstructions: [buildMemoIx({ account, payload }), ix]});
    if (!encodedSignedTx) throw Error("No Tx");
    mutate({ signedTx: encodedSignedTx }, { onSuccess });
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
