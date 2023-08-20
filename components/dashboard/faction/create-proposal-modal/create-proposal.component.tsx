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
  Input,
  Textarea,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Select,
} from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useCreateFaction } from "@/hooks/useCreateFaction";
import { useSolana } from "@/hooks/useSolana";
import { Character, Proposal } from "@/types/server";
import { useCreateProposal } from "@/hooks/useCreateProposal";
import { useFetchProposalsByFaction } from "@/hooks/useProposalsByFaction";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { ProposalForm } from "./proposal-form.component";

enum ProposalNames {
  BUILD = "CONSTRUCT A BUILDING",
  UPGRADE = "UPGRADE A BUILDING",
  ATK_CITY = "ATTACK CITY",
  ATK_RF = "ATTACK RESOURCE FIELD",
  WITHDRAW = "WITHDRAW RESOURCES",
  MINT = "MINT VOTING SHARES",
  ALLOCATE = "ALLOCATE RESOURCES TO CITIZEN",
  THRESHOLD = "PROPOSE NEW VOTING THRESHOLD",
  WARBAND = "ASSEMBLE WARBAND",
  TAX = "PROPOSE NEW TAX RATE",
  BURN = "BURN RESOURCE(S)",
}

export const CreateProposal: React.FC<{
  currentCharacter?: Character;
  fire: () => void;
}> = ({ currentCharacter, fire: fireConfetti }) => {
  const { mutate } = useCreateProposal();
  const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter();
  const {
    connection,
    walletAddress,
    signTransaction,
    buildMemoIx,
    buildTransferIx,
    encodeTransaction,
    getBonkBalance,
  } = useSolana();

  const factionId = currentCharacter?.faction?.id;
  const { data: allProposals, refetch } = useFetchProposalsByFaction(
    factionId,
    0,
    10
  );
  const { isOpen, onOpen, onClose: closeIt } = useDisclosure();

  const onClose = () => {
    closeIt();
  };

  const handleCreateProposal = async () => {
    // if (!validateInputs()) {
    //   return;
    // }
    // const prpsl = {
    //   type: "TAX",
    //   newTaxRate: Number(proposal?.tax),
    // };
    // const payload = {
    //   mint: selectedCharacter?.mint,
    //   timestamp: Date.now().toString(),
    //   proposal: prpsl,
    // };
    // if (!walletAddress) return console.error("No wallet");
    // const encodedSignedTx = await encodeTransaction({
    //   walletAddress,
    //   connection,
    //   signTransaction,
    //   txInstructions: [buildMemoIx({ walletAddress, payload })],
    // });

    // if (typeof encodedSignedTx === "string") {
    //   mutate({ signedTx: encodedSignedTx }, { onSuccess });
    // } else {
    //   toast.error("Failed to create proposal tx");
    //   console.error(encodedSignedTx);
    // }
  };


  return (
    <>
      <Text
        fontSize="1.5rem"
        color="brand.secondary"
        cursor="pointer"
        onClick={onOpen}
      >
        CREATE +
      </Text>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent
          bg={colors.brand.primary}
          maxW="75rem"
          m="auto"
          p={10}
          display="flex"
          flexDirection="column"
          borderRadius="1rem"
        >
          <ModalHeader fontSize="24px" fontWeight="bold" letterSpacing="3px">
            CREATE A PROPOSAL
          </ModalHeader>
          <ModalCloseButton position="absolute" top="30px" right="30px" />
          <ModalBody flex="1">
            <Box w="100%" h="100%">
              <ProposalForm/>
            </Box>
          </ModalBody>
          {/* <ModalFooter>
            <CreateButton
              onClick={handleCreateProposal}
              _hover={{
                backgroundColor: colors.blacks[700],
                border: `2px solid ${colors.blacks[700]}`,
              }}
            >
              Create Proposal
            </CreateButton>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
};

const inputStyles = {
  backgroundColor: colors.blacks[600],
  height: "5rem",
  width: "100%",
  borderRadius: "4px",
  padding: "1rem 2rem",
  fontWeight: "500",
  letterSpacing: "1px",
  color: colors.brand.quaternary,
};

const StyledInput = styled(Input)`
  ${inputStyles}

  &:disabled {
    background-color: ${colors.blacks[500]} !important;
  }
`;

const CreateButton = styled(Button)`
  background-color: ${colors.brand.quaternary};
  border: 2px solid ${colors.brand.quaternary};
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  width: 100%;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: 1px;
`;



const StyledTextarea = styled(Textarea)`
  ${inputStyles}
`;
