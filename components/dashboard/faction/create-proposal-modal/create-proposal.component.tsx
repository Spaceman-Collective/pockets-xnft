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
import { Character, Proposal, ProposalTypes } from "@/types/server";
import { useCreateProposal } from "@/hooks/useCreateProposal";
import { useFetchProposalsByFaction } from "@/hooks/useProposalsByFaction";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";
import toast from "react-hot-toast";
import { BLUEPRINTS } from "../tabs/services-tab/constants";
import { FaTimes } from "react-icons/fa";
import { z } from "zod";

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
  const [proposalType, setProposalType] = useState<string>("");

  const handleProposalTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedType = event.target.value;
    setProposalType(selectedType);
  };

  const onSuccess = (data: any) => {
    fireConfetti();
    refetch();
    toast.success("Proposal created!");
    onClose();
  };

  const [proposal, setProposal] = useState<any>({});

  const handleCreateProposal = async () => {
    const CreateProposalData = z.object({
      mint: z.string(),
      timestamp: z.string(),
      proposal: z.object({
        type: z.union([
          z.literal("BUILD"),
          z.literal("UPGRADE"),
          z.literal("WITHDRAW"),
          z.literal("MINT"),
          z.literal("ALLOCATE"),
          z.literal("THRESHOLD"),
          z.literal("THRESHOLD"),
          z.literal("TAX"),
          z.literal("BURN"),
        ]),
        blueprintName: z.string().optional(),
        stationId: z.string().optional(),
        citizen: z.string().optional(),
        amount: z.string().optional(),
        resources: z
          .array(z.object({ resourceId: z.string(), amount: z.number() }))
          .optional(),
        bonk: z.string().optional(),
        newSharesToMint: z.string().optional(),
        newThreshold: z.string().optional(),
        newTaxRate: z.number().max(100).min(1).optional(),
      }),
    });

    const payloadAttempt = {
      mint: selectedCharacter?.mint,
      timestamp: Date.now().toString(),
      proposal,
    };

    const payload = CreateProposalData.parse(payloadAttempt);
    console.log(payload);
    if (!walletAddress) return console.error("No wallet");
    const encodedSignedTx = await encodeTransaction({
      walletAddress,
      connection,
      signTransaction,
      txInstructions: [buildMemoIx({ walletAddress, payload })],
    });

    if (typeof encodedSignedTx === "string") {
      mutate({ signedTx: encodedSignedTx }, { onSuccess });
    } else {
      toast.error("Failed to create proposal tx");
      console.error(encodedSignedTx);
    }
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
              <VStack spacing={2} width="100%">
                <Box mb="2rem" w="100%">
                  <Select onChange={handleProposalTypeChange}>
                    <option value="">SELECT A PROPOSAL TYPE</option>
                    {ProposalTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </Box>

                {proposalType === "BUILD" && (
                  <Box mb="2rem" w="100%">
                    <Select
                      fontWeight="500"
                      className="customSelect"
                      placeholder="Select a blueprint name"
                      onChange={(e) => {
                        console.log(e.target.value);
                        setProposal({
                          type: "BUILD",
                          blueprintName: e.target.value,
                        });
                      }}
                    >
                      {BLUEPRINTS.map((blueprint) => (
                        <option key={blueprint.name} value={blueprint.name}>
                          {blueprint.name}
                        </option>
                      ))}
                    </Select>
                  </Box>
                )}

                {proposalType === "UPGRADE" && (
                  <Box mb="2rem" w="100%">
                    <StyledInput
                      placeholder="Enter station ID or Townhall"
                      disabled={true}
                    />
                    {
                      // TODO: Add select for stations using factionData
                    }
                  </Box>
                )}

                {proposalType === "WITHDRAW" && (
                  <Stack spacing={4} w="100%">
                    <Box mb="2rem" w="100%">
                      <Select placeholder="Select a citizen"></Select>
                    </Box>
                    {
                      // TODO: Add fields for Resources and Bonk
                    }
                  </Stack>
                )}

                {proposalType === "MINT" && (
                  <Box mb="2rem" w="100%">
                    <StyledInput
                      placeholder="Enter new shares to mint"
                      w="100%"
                    />
                    {
                      // TODO add input for # of new shares to mint
                    }
                  </Box>
                )}

                {proposalType === "ALLOCATE" && (
                  <Stack spacing={4} w="100%">
                    <Box mb="2rem" w="100%">
                      <StyledInput placeholder="Enter citizen value" w="100%" />
                    </Box>
                    <Box mb="2rem" w="100%">
                      <StyledInput placeholder="Enter amount" w="100%" />
                    </Box>
                  </Stack>
                )}

                {proposalType === "THRESHOLD" && (
                  <Box mb="2rem" w="100%">
                    <StyledInput placeholder="Enter new threshold" w="100%" />
                  </Box>
                )}

                {proposalType === "TAX" && (
                  <Box mb="2rem" w="100%">
                    <NumberInput
                      defaultValue={0}
                      max={100}
                      min={0}
                      onChange={(value) =>
                        setProposal({
                          type: "TAX",
                          newTaxRate: parseInt(value),
                        })
                      }
                    >
                      <NumberInputField
                        bg={colors.blacks[600]}
                        p="1rem"
                        h="5rem"
                        borderRadius="4px"
                      />
                      <NumberInputStepper pr="1rem">
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Box>
                )}

                {proposalType === "BURN" && (
                  <Box mb="2rem" w="100%">
                    <StyledInput
                      placeholder="Enter amount of resource to burn"
                      w="100%"
                    />
                  </Box>
                )}
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <CreateButton
              onClick={handleCreateProposal}
              _hover={{
                backgroundColor: colors.blacks[700],
                border: `2px solid ${colors.blacks[700]}`,
              }}
            >
              Create Proposal
            </CreateButton>
          </ModalFooter>
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

const StyledInput = styled(Input)`
  ${inputStyles}

  &:disabled {
    background-color: ${colors.blacks[500]} !important;
  }
`;

const StyledTextarea = styled(Textarea)`
  ${inputStyles}
`;
