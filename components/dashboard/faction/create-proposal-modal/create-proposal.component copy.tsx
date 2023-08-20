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
import { BLUEPRINTS } from "../tabs/services-tab/constants";
import { FaTimes } from "react-icons/fa";

enum ProposalType {
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
    setProposalType("");
    setProposal({
      id: '', 
      type: "BUILD",
      blueprintName: undefined,
      stationId: undefined,
      factionId: undefined,
      rfId: undefined,
      citizen: undefined,
      resources: undefined,
      bonk: undefined,
      newSharesToMint: undefined,
      amount: undefined,
      newThreshold: undefined,
      warband: undefined,
      newTaxRate: undefined,
    });
    closeIt();
  };


  const [proposal, setProposal] = useState<Proposal>({
    id: '', 
    type: "BUILD",
    blueprintName: undefined,
    stationId: undefined,
    factionId: undefined,
    rfId: undefined,
    citizen: undefined,
    resources: undefined,
    bonk: undefined,
    newSharesToMint: undefined,
    amount: undefined,
    newThreshold: undefined,
    warband: undefined,
    newTaxRate: undefined,
  });


  const citizenIds = [
    'CITZ-1234',
    'CITZ-1235',
    'CITZ-1236',
    'CITZ-1237',
    'CITZ-1238',
    'CITZ-1239',
    'CITZ-1240',
    'CITZ-1241',
    'CITZ-1242',
    'CITZ-1243'
  ];


  const [proposalType, setProposalType] = useState<ProposalType | "">("");

  const handleProposalTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedType = event.target.value as ProposalType;
    setProposalType(selectedType);
    setProposal(prevProposal => ({
      ...prevProposal,
      type: selectedType
    }));
  };

  const [inputErrors, setInputErrors] = useState({
    id: '',
    type: "",
    blueprintName: "",
    station: "",
    factionID: "",
    rfID: "",
    characterMint: "",
    resources: "",
    bonk: "",
    newSharesToMint: "",
    citizen: "",
    amount: "",
    newThreshold: "",
    warband: "",
    tax: "",
    burn: "",
  });

  const validateInputs = () => {
    let errors = {
      id: '',
      type: "",
      blueprintName: "",
      station: "",
      factionID: "",
      rfID: "",
      characterMint: "",
      resources: "",
      bonk: "",
      newSharesToMint: "",
      citizen: "",
      amount: "",
      newThreshold: "",
      warband: "",
      tax: "",
      burn: "",
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
      if (!proposal.resources || proposal.resources.length === 0) {
        errors.resources = "Resources are required";
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
    if (proposalType === ProposalType.WARBAND && (!proposal.warband || proposal.warband.length === 0)) {
      errors.warband = "Warband details are required";
      isValid = false;
    }

    // TAX
    if (
      proposalType === ProposalType.TAX &&
      (proposal.tax === null ||
        proposal.tax === undefined ||
        proposal.tax === "0" ||
        !proposal.tax.trim())
    ) {
      errors.tax = "Tax value is required";
      isValid = false;
    }

    // BURN
    if (proposalType === ProposalType.BURN && !proposal.burn.trim()) {
      errors.burn = "Amount of resources to burn is required";
      isValid = false;
    }

    setInputErrors(errors);
    return isValid;
  };

  const onSuccess = (data: any) => {
    fireConfetti();
    refetch();
    toast.success("Proposal created!");
    onClose();
  };

  const handleCreateProposal = async () => {
    if (!validateInputs()) {
      return;
    }
    const prpsl = {
      type: "TAX",
      newTaxRate: Number(proposal?.tax),
    };
    const payload = {
      mint: selectedCharacter?.mint,
      timestamp: Date.now().toString(),
      proposal: prpsl,
    };
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
                    {Object.values(ProposalType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </Box>

                {proposalType === ProposalType.BUILD && (
                  <Box mb="2rem" w="100%">
                    <Select
                      fontWeight="500"
                      className="customSelect"
                      placeholder="Select a blueprint name"
                      value={proposal.blueprintName}
                      onChange={(e: { target: { value: any } }) =>
                        setProposal({
                          ...proposal,
                          blueprintName: e.target.value,
                        })
                      }
                      isInvalid={!!inputErrors.blueprintName}
                    >
                      {BLUEPRINTS.map((blueprint) => (
                        <option key={blueprint.name} value={blueprint.name}>
                          {blueprint.name}
                        </option>
                      ))}
                    </Select>

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
                      disabled={true}
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
                      disabled={true}
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
                      disabled={true}
                    />
                    {inputErrors.rfID && (
                      <Text color="red.500">{inputErrors.rfID}</Text>
                    )}
                  </Box>
                )}

                {proposalType === ProposalType.WITHDRAW && (
                  <Stack spacing={4} w="100%">
                    <Box mb="2rem" w="100%">
                      <Select
                        placeholder="Select a citizen"
                        value={proposal.citizen}
                        onChange={(e) =>
                          setProposal({
                            ...proposal,
                            citizen: e.target.value,
                          })
                        }
                      >
                        {citizenIds.map((id) => (
                          <option key={id} value={id}>{id}</option>
                        ))}

                      </Select>
                      {inputErrors.citizen && (
                        <Text color="red.500">{inputErrors.citizen}</Text>
                      )}
                    </Box>

                    {proposal.resources.map((resource, index) => (
                      <Box mb="2rem" w="100%" key={index} position="relative">
                        <FaTimes
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "10px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            const newResources = [...proposal.resources];
                            newResources.splice(index, 1);
                            setProposal({
                              ...proposal,
                              resources: newResources,
                            });
                          }}
                        />
                        <StyledInput
                          placeholder="Enter resource name"
                          value={resource.resourceName}
                          onChange={(e) => {
                            const newResources = [...proposal.resources];
                            newResources[index].resourceName = e.target.value;
                            setProposal({
                              ...proposal,
                              resources: newResources,
                            });
                          }}
                          isInvalid={
                            !!inputErrors.resources?.[index]?.resourceName
                          }
                        />
                        {inputErrors.resources?.[index]?.resourceName && (
                          <Text color="red.500">
                            {inputErrors.resources[index].resourceName}
                          </Text>
                        )}

                        <NumberInput
                          defaultValue={0}
                          value={resource.amount}
                          onChange={(value) => {
                            const newResources = [...proposal.resources];
                            newResources[index].amount = value;
                            setProposal({
                              ...proposal,
                              resources: newResources,
                            });
                          }}
                          isInvalid={!!inputErrors.resources?.[index]?.amount}
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
                        {inputErrors.resources?.[index]?.amount && (
                          <Text color="red.500">
                            {inputErrors.resources[index].amount}
                          </Text>
                        )}
                      </Box>
                    ))}

                    {/* Add Resource Button (to add more resources) */}
                    <Button
                      onClick={() =>
                        setProposal((prev) => ({
                          ...prev,
                          resources: [
                            ...prev.resources,
                            { resourceName: "", amount: 0 },
                          ],
                        }))
                      }
                    >
                      Add Resource
                    </Button>

                    {/* BONK Input */}
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

                {proposalType === ProposalType.BURN && (
                  <Box mb="2rem" w="100%">
                    <StyledInput
                      value={proposal.burn}
                      onChange={(e) =>
                        setProposal({
                          ...proposal,
                          burn: e.target.value,
                        })
                      }
                      placeholder="Enter amount of resource to burn"
                      w="100%"
                      isInvalid={!!inputErrors.newThreshold}
                    />
                    {inputErrors.newThreshold && (
                      <Text color="red.500">{inputErrors.newThreshold}</Text>
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
