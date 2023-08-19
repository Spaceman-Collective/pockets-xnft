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
  Select,
  Input,
  Textarea,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
} from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useCreateFaction } from "@/hooks/useCreateFaction";
import { useSolana } from "@/hooks/useSolana";
import { Character } from "@/types/server";
import { useCreateProposal } from "@/hooks/useCreateProposal";

enum ProposalType {
  BUILD = "BUILD",
  UPGRADE = "UPGRADE",
  ATK_CITY = "ATK_CITY",
  ATK_RF = "ATK_RF",
  WITHDRAW = "WITHDRAW",
  MINT = "MINT",
  ALLOCATE = "ALLOCATE",
  THRESHOLD = "THRESHOLD",
  WARBAND = "WARBAND",
  TAX = "TAX PERCENTAGE",
}

export const CreateProposal: React.FC<{ currentCharacter?: Character; 
  fire: () => void
}> = ({
  fire: fireConfetti,
  currentCharacter,
}) => {
  const { mutate } = useCreateProposal();
  const {
    connection,
    walletAddress,
    signTransaction,
    buildMemoIx,
    buildTransferIx,
    encodeTransaction,
    getBonkBalance,
  } = useSolana();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [proposal, setProposal] = useState({
    type: "",
    blueprintName: "",
    station: "",
    factionID: "",
    rfID: "",
    characterMint: "",
    resourceName: "",
    bonk: "",
    newSharesToMint: "",
    citizen: "",
    amount: "",
    newThreshold: "",
    warband: "",
    tax: "",
  });

  const [proposalType, setProposalType] = useState<ProposalType | "">("");

  const handleProposalTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProposalType(event.target.value as ProposalType);
    setProposal({
      ...proposal,
      type: event.target.value,
    })
  };
  const [inputErrors, setInputErrors] = useState({
    type: "",
    blueprintName: "",
    station: "",
    factionID: "",
    rfID: "",
    characterMint: "",
    resourceName: "",
    bonk: "",
    newSharesToMint: "",
    citizen: "",
    amount: "",
    newThreshold: "",
    warband: "",
    tax: "",
  });

  const validateInputs = () => {
    let errors = {
      type: "",
      blueprintName: "",
      station: "",
      factionID: "",
      rfID: "",
      characterMint: "",
      resourceName: "",
      bonk: "",
      newSharesToMint: "",
      citizen: "",
      amount: "",
      newThreshold: "",
      warband: "",
      tax: "",
    };

    let isValid = true;

    // BUILD
    if (proposalType === ProposalType.BUILD && !proposal.blueprintName.trim()) {
      errors.blueprintName = "Blueprint name is required.";
      isValid = false;
    }

    // UPGRADE
    if (proposalType === ProposalType.UPGRADE && !proposal.station.trim()) {
      errors.station = "Station ID or Townhall is required.";
      isValid = false;
    }

    // ATK_CITY
    if (proposalType === ProposalType.ATK_CITY && !proposal.factionID.trim()) {
      errors.factionID = "Faction ID is required.";
      isValid = false;
    }

    // ATK_RF
    if (proposalType === ProposalType.ATK_RF && !proposal.rfID.trim()) {
      errors.rfID = "RF ID is required.";
      isValid = false;
    }

    // WITHDRAW
    if (proposalType === ProposalType.WITHDRAW) {
      if (!proposal.characterMint.trim()) {
        errors.characterMint = "Character mint is required";
        isValid = false;
      }
      if (!proposal.amount.trim()) {
        errors.amount = "Resource amount is required";
        isValid = false;
      }
      if (!proposal.resourceName.trim()) {
        errors.resourceName = "Resource name is required";
        isValid = false;
      }
      if (!proposal.bonk.trim()) {
        errors.bonk = "BONK value is required";
        isValid = false;
      }
    }

    // MINT
    if (
      proposalType === ProposalType.MINT &&
      !proposal.newSharesToMint.trim()
    ) {
      errors.newSharesToMint = "New shares to mint value is required";
      isValid = false;
    }

    // ALLOCATE
    if (proposalType === ProposalType.ALLOCATE) {
      if (!proposal.citizen.trim()) {
        errors.citizen = "Citizen value is required";
        isValid = false;
      }
      if (!proposal.amount.trim()) {
        errors.amount = "Amount is required";
        isValid = false;
      }
    }

    // THRESHOLD
    if (
      proposalType === ProposalType.THRESHOLD &&
      !proposal.newThreshold.trim()
    ) {
      errors.newThreshold = "New threshold value is required";
      isValid = false;
    }

    // WARBAND
    if (proposalType === ProposalType.WARBAND && !proposal.warband.trim()) {
      errors.warband = "Warband details are required";
      isValid = false;
    }

    // TAX
    if (
      proposalType === ProposalType.TAX &&
      (proposal.tax === null || proposal.tax === undefined || proposal.tax === "0" || !proposal.tax.trim())
    ) {
      errors.tax = "Tax value is required";
      isValid = false;
    }

    setInputErrors(errors);
    return isValid;
  };

  const onSuccess = (data: any) => {
    fireConfetti();
    console.log('proposal created!');
  };

  const handleCreateProposal = async () => {
    if (!validateInputs()) {
      return;
    }
    console.log("proposal: ", proposal);
    const prpsl = {
      type: "TAX",
      newTaxRate: Number(proposal?.tax),
    }
    const payload = {
      mint: 'CppHyx5oQ5vGGTEDk3ii5LtdzmAbdAffrqqip7AWWkdZ',
      timestamp: Date.now().toString(),
      proposal: prpsl
    };
    const encodedSignedTx = await encodeTransaction({ walletAddress, connection, signTransaction, txInstructions: [buildMemoIx({ walletAddress, payload })]});
      
    if (!encodedSignedTx) throw Error("No Tx");
    mutate({ signedTx: encodedSignedTx }, { onSuccess });
    onClose();
  };

  return (
    <>
      <Text fontSize="1.5rem" color="brand.secondary" cursor="pointer" onClick={onOpen}>
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
                  <StyledSelect onChange={handleProposalTypeChange}>
                    <option value="">SELECT A PROPOSAL TYPE</option>
                    {Object.values(ProposalType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </StyledSelect>
                </Box>

                {proposalType === ProposalType.BUILD && (
                  <Box mb="2rem" w="100%">
                    <StyledInput
                      placeholder="Enter blueprint name"
                      value={proposal.blueprintName}
                      onChange={(e) =>
                        setProposal({
                          ...proposal,
                          blueprintName: e.target.value,
                        })
                      }
                      isInvalid={!!inputErrors.blueprintName}
                    />

                    {inputErrors.blueprintName && (
                      <Text color="red.500">{inputErrors.blueprintName}</Text>
                    )}
                  </Box>
                )}

                {proposalType === ProposalType.UPGRADE && (
                  <Box mb="2rem" w="100%">
                    <StyledInput
                      placeholder="Enter station ID or Townhall"
                      value={proposal.station}
                      onChange={(e) =>
                        setProposal({
                          ...proposal,
                          station: e.target.value,
                        })
                      }
                      isInvalid={!!inputErrors.station}
                    />
                    {inputErrors.station && (
                      <Text color="red.500">{inputErrors.station}</Text>
                    )}
                  </Box>
                )}

                {proposalType === ProposalType.ATK_CITY && (
                  <Box mb="2rem" w="100%">
                    <StyledInput
                      placeholder="Enter faction ID"
                      value={proposal.factionID}
                      onChange={(e) =>
                        setProposal({
                          ...proposal,
                          factionID: e.target.value,
                        })
                      }
                      isInvalid={!!inputErrors.factionID}
                    />
                    {inputErrors.factionID && (
                      <Text color="red.500">{inputErrors.factionID}</Text>
                    )}
                  </Box>
                )}

                {proposalType === ProposalType.ATK_RF && (
                  <Box mb="2rem" w="100%">
                    <StyledInput
                      placeholder="Enter RF ID"
                      value={proposal.rfID}
                      onChange={(e) =>
                        setProposal({
                          ...proposal,
                          rfID: e.target.value,
                        })
                      }
                      isInvalid={!!inputErrors.rfID}
                    />
                    {inputErrors.rfID && (
                      <Text color="red.500">{inputErrors.rfID}</Text>
                    )}
                  </Box>
                )}

                {proposalType === ProposalType.WITHDRAW && (
                  <Stack spacing={4} w="100%">
                    <Box mb="2rem" w="100%">
                      <StyledInput
                        placeholder="Enter character mint"
                        value={proposal.characterMint}
                        onChange={(e) =>
                          setProposal({
                            ...proposal,
                            characterMint: e.target.value,
                          })
                        }
                        isInvalid={!!inputErrors.characterMint}
                      />
                      {inputErrors.characterMint && (
                        <Text color="red.500">{inputErrors.characterMint}</Text>
                      )}
                    </Box>
                    <Box mb="2rem" w="100%">
                      <StyledInput
                        placeholder="Enter resource name"
                        value={proposal.resourceName}
                        onChange={(e) =>
                          setProposal({
                            ...proposal,
                            resourceName: e.target.value,
                          })
                        }
                        isInvalid={!!inputErrors.resourceName}
                      />
                      {inputErrors.resourceName && (
                        <Text color="red.500">{inputErrors.resourceName}</Text>
                      )}
                    </Box>
                    <Box mb="2rem" w="100%">
                      <NumberInput
                        defaultValue={0}
                        value={proposal.amount}
                        onChange={(value) =>
                          setProposal({
                            ...proposal,
                            amount: value,
                          })
                        }
                        isInvalid={!!inputErrors.amount}
                      >
                        <NumberInputField
                          w="100%"
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
                      {inputErrors.amount && (
                        <Text color="red.500">{inputErrors.amount}</Text>
                      )}
                    </Box>

                    <Box mb="2rem" w="100%">
                      <StyledInput
                        placeholder="Enter BONK value"
                        value={proposal.bonk}
                        onChange={(e) =>
                          setProposal({
                            ...proposal,
                            bonk: e.target.value,
                          })
                        }
                        isInvalid={!!inputErrors.bonk}
                      />
                      {inputErrors.bonk && (
                        <Text color="red.500">{inputErrors.bonk}</Text>
                      )}
                    </Box>
                  </Stack>
                )}

                {proposalType === ProposalType.MINT && (
                  <Box mb="2rem" w="100%">
                    <StyledInput
                      value={proposal.newSharesToMint}
                      onChange={(e) =>
                        setProposal({
                          ...proposal,
                          newSharesToMint: e.target.value,
                        })
                      }
                      placeholder="Enter new shares to mint"
                      w="100%"
                      isInvalid={!!inputErrors.newSharesToMint}
                    />
                    {inputErrors.newSharesToMint && (
                      <Text color="red.500">{inputErrors.newSharesToMint}</Text>
                    )}
                  </Box>
                )}

                {proposalType === ProposalType.ALLOCATE && (
                  <Stack spacing={4} w="100%">
                    <Box mb="2rem" w="100%">
                      <StyledInput
                        value={proposal.citizen}
                        onChange={(e) =>
                          setProposal({
                            ...proposal,
                            citizen: e.target.value,
                          })
                        }
                        placeholder="Enter citizen value"
                        w="100%"
                        isInvalid={!!inputErrors.citizen}
                      />
                      {inputErrors.citizen && (
                        <Text color="red.500">{inputErrors.citizen}</Text>
                      )}
                    </Box>
                    <Box mb="2rem" w="100%">
                      <StyledInput
                        value={proposal.amount}
                        onChange={(e) =>
                          setProposal({ ...proposal, amount: e.target.value })
                        }
                        placeholder="Enter amount"
                        w="100%"
                        isInvalid={!!inputErrors.amount}
                      />
                      {inputErrors.amount && (
                        <Text color="red.500">{inputErrors.amount}</Text>
                      )}
                    </Box>
                  </Stack>
                )}

                {proposalType === ProposalType.THRESHOLD && (
                  <Box mb="2rem" w="100%">
                    <StyledInput
                      value={proposal.newThreshold}
                      onChange={(e) =>
                        setProposal({
                          ...proposal,
                          newThreshold: e.target.value,
                        })
                      }
                      placeholder="Enter new threshold"
                      w="100%"
                      isInvalid={!!inputErrors.newThreshold}
                    />
                    {inputErrors.newThreshold && (
                      <Text color="red.500">{inputErrors.newThreshold}</Text>
                    )}
                  </Box>
                )}

                {proposalType === ProposalType.WARBAND && (
                  <Box mb="2rem" w="100%">
                    <StyledTextarea
                      value={proposal.warband}
                      onChange={(e) =>
                        setProposal({ ...proposal, warband: e.target.value })
                      }
                      placeholder="Enter warband, separated by commas"
                      w="100%"
                      isInvalid={!!inputErrors.warband}
                    />
                    {inputErrors.warband && (
                      <Text color="red.500">{inputErrors.warband}</Text>
                    )}
                  </Box>
                )}

                {proposalType === ProposalType.TAX && (
                  <Box mb="2rem" w="100%">
                    <NumberInput
                      value={proposal.tax}
                      onChange={(valueString) =>
                        setProposal({ ...proposal, tax: valueString })
                      }
                      defaultValue={0}
                      max={100}
                      min={0}
                      isInvalid={!!inputErrors.tax}
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
                    {inputErrors.tax && (
                      <Text color="red.500">{inputErrors.tax}</Text>
                    )}
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
                border: `2px solid ${colors.blacks[700]}`
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

const selectStyles = css`
  background-color: ${colors.blacks[600]};
  height: 5rem;
  width: 100%;
  border-radius: 4px;
  padding: 1rem 2rem;
  font-weight: 600;
  letter-spacing: 1px;
`;

const inputStyles = css`
  background-color: ${colors.blacks[600]};
  height: 5rem;
  width: 100%;
  border-radius: 4px;
  padding: 1rem 2rem;
  font-weight: 500;
  letter-spacing: 1px;
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

const StyledSelect = styled(Select)`
  ${selectStyles}
`;

const StyledInput = styled(Input)`
  ${inputStyles}
`;

const StyledTextarea = styled(Textarea)`
  ${inputStyles}
`;
