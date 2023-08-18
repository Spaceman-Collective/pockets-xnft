import {
  Box,
  Input,
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
  Select as ChakraSelect,
  Input as ChakraInput,
  Textarea as ChakraTextarea,
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

export const CreateProposal: React.FC = () => {
  const { isOpen, onOpen, onClose: chakraOnClose } = useDisclosure();
  const [proposal, setProposal] = useState({
    title: "",
    description: "",
    blueprintName: "",
    stationID: "",
    factionID: "",
    rfID: "",
    characterMint: "",
    resourceName: "",
    bonkValue: "",
    newSharesToMint: "",
    citizenValue: "",
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
  };
  const [inputErrors, setInputErrors] = useState({
    description: "",
    blueprintName: "",
    stationID: "",
    factionID: "",
    rfID: "",
    characterMint: "",
    resourceName: "",
    bonkValue: "",
    newSharesToMint: "",
    citizenValue: "",
    amount: "",
    newThreshold: "",
    warband: "",
    tax: "",
  });

  const validateInputs = () => {
    let errors = {
      description: "",
      blueprintName: "",
      stationID: "",
      factionID: "",
      rfID: "",
      characterMint: "",
      resourceName: "",
      bonkValue: "",
      newSharesToMint: "",
      citizenValue: "",
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
    if (proposalType === ProposalType.UPGRADE && !proposal.stationID.trim()) {
      errors.stationID = "Station ID or Townhall is required.";
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
      if (!proposal.bonkValue.trim()) {
        errors.bonkValue = "BONK value is required";
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
      if (!proposal.citizenValue.trim()) {
        errors.citizenValue = "Citizen value is required";
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

  const handleCreateProposal = async () => {
    if (!validateInputs()) {
      return;
    }
    console.log("proposal: ", proposal);
    // Add proposal creation logic here.
  };

  return (
    <>
      <Text color="brand.secondary" cursor="pointer" onClick={onOpen}>
        create +
      </Text>
      <Modal isOpen={isOpen} onClose={chakraOnClose} size="xl">
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
                      value={proposal.stationID}
                      onChange={(e) =>
                        setProposal({
                          ...proposal,
                          stationID: e.target.value,
                        })
                      }
                      isInvalid={!!inputErrors.stationID}
                    />
                    {inputErrors.stationID && (
                      <Text color="red.500">{inputErrors.stationID}</Text>
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
                        value={proposal.bonkValue}
                        onChange={(e) =>
                          setProposal({
                            ...proposal,
                            bonkValue: e.target.value,
                          })
                        }
                        isInvalid={!!inputErrors.bonkValue}
                      />
                      {inputErrors.bonkValue && (
                        <Text color="red.500">{inputErrors.bonkValue}</Text>
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
                        value={proposal.citizenValue}
                        onChange={(e) =>
                          setProposal({
                            ...proposal,
                            citizenValue: e.target.value,
                          })
                        }
                        placeholder="Enter citizen value"
                        w="100%"
                        isInvalid={!!inputErrors.citizenValue}
                      />
                      {inputErrors.citizenValue && (
                        <Text color="red.500">{inputErrors.citizenValue}</Text>
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
            <Button
              w="100%"
              bg={colors.brand.quaternary}
              onClick={handleCreateProposal}
              mb="1rem"
            >
              Create Proposal
            </Button>
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

const StyledSelect = styled(ChakraSelect)`
  ${selectStyles}
`;

const StyledInput = styled(ChakraInput)`
  ${inputStyles}
`;

const StyledTextarea = styled(ChakraTextarea)`
  ${inputStyles}
`;
