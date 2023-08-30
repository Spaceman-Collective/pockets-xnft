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
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useCreateFaction } from "@/hooks/useCreateFaction";
import { useSolana } from "@/hooks/useSolana";
import { Character, Faction, Proposal, ProposalTypes } from "@/types/server";
import { useCreateProposal } from "@/hooks/useCreateProposal";
import { useFetchProposalsByFaction } from "@/hooks/useProposalsByFaction";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";
import toast from "react-hot-toast";
import { BLUEPRINTS } from "@/types/server/Station";
import { FaTimes } from "react-icons/fa";
import { z } from "zod";
import { useFaction } from "@/hooks/useFaction";
import { Value } from "../tabs/tab.styles";
import { useQueryClient } from "@tanstack/react-query";

type FactionData =
  | {
      citizens: Character[];
      faction: Faction;
      resources: {
        name: string;
        value: string;
      }[];
      stations: {
        blueprint: string;
        faction: string;
        id: string;
        level: number;
      }[];
    }
  | undefined;

export const CreateProposal: React.FC<{
  factionData: FactionData;
  currentCharacter?: Character;
  fire: () => void;
}> = ({ currentCharacter, fire: fireConfetti, factionData }) => {
  const { mutate, isLoading } = useCreateProposal();
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

  const { data: allProposals, refetch } = useFetchProposalsByFaction(
    currentCharacter?.faction?.id,
    0,
    10
  );

  const { isOpen, onOpen, onClose: closeIt } = useDisclosure();

  const onClose = () => {
    closeIt();
  };

  const [proposalType, setProposalType] = useState<string>("");
  const [proposal, setProposal] = useState<any>({});
  const [unallocatedVotingPower, setUnallocatedVotingPower] =
    useState<string>("0");

  const handleProposalTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedType = event.target.value;
    setProposalType(selectedType);
  };

  const queryClient = useQueryClient();
  const onSuccess = (data: any) => {
    queryClient.refetchQueries({ queryKey: ["fetch-proposals-by-faction"] });
    fireConfetti();
    refetch();
    toast.success("Proposal created!");
    onClose();
  };

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
          z.literal("TAX"),
          z.literal("BURN"),
        ]),
        blueprintName: z.string().optional(),
        stationId: z.string().optional(),
        citizen: z.string().optional(),
        amount: z.string().optional(),
        resources: z
          .array(z.object({ resourceName: z.string(), amount: z.number() }))
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
                        setProposal({
                          type: "BUILD",
                          blueprintName: e.target.value,
                        });
                      }}
                    >
                      {BLUEPRINTS.map((blueprint) => (
                        <option key={blueprint.name} value={blueprint.name}>
                          {blueprint.name} / Cost:{" "}
                          {blueprint.upgradeResources[0].map(
                            (resource, resourceIndex) => (
                              <span key={resourceIndex}>
                                {resource.resource} x{resource.amount}
                                {resourceIndex !==
                                  blueprint.upgradeResources[0].length - 1 &&
                                  ", "}
                              </span>
                            )
                          )}
                        </option>
                      ))}
                    </Select>
                  </Box>
                )}

                {proposalType === "UPGRADE" && (
                  <Box mb="2rem" w="100%">
                    <Select
                      fontWeight="500"
                      placeholder="Select a station to upgrade"
                      onChange={(e) => {
                        setProposal({
                          type: "UPGRADE",
                          stationId: e.target.value,
                        });
                      }}
                    >
                      {factionData?.stations?.map((station) => (
                        <option
                          key={station?.blueprint}
                          value={station?.blueprint}
                        >
                          {station?.blueprint} / current lvl: {station?.level} /
                          id: {station?.id}
                        </option>
                      ))}
                    </Select>
                  </Box>
                )}

                {proposalType === "WITHDRAW" && (
                  <Stack spacing={4} w="100%">
                    {/* Citizen Selector */}
                    <Box mb="2rem">
                      <Select
                        fontWeight="500"
                        className="customSelect"
                        placeholder="Select a citizen"
                        onChange={(e) => {
                          setProposal({
                            type: "WITHDRAW",
                            citizen: e.target.value,
                          });
                        }}
                      >
                        {factionData?.citizens?.map((citizen: Character) => (
                          <option key={citizen.mint} value={citizen.mint}>
                            {citizen.name}
                          </option>
                        ))}
                      </Select>
                    </Box>

                    {/* Resource Selector */}
                    <Box mb="2rem" w="100%">
                      <Select
                        fontWeight="500"
                        className="customSelect"
                        placeholder="Select a resource"
                        onChange={(e) => {
                          setProposal((prevState: { resources: any }) => {
                            const newResources = prevState.resources
                              ? [...prevState.resources]
                              : [];
                            if (newResources.length === 0) {
                              newResources.push({
                                resourceName: e.target.value,
                                d: 0,
                              });
                            } else {
                              newResources[0].resourceName = e.target.value;
                            }
                            return { ...prevState, resources: newResources };
                          });
                        }}
                      >
                        {factionData?.resources?.map((resource) => (
                          <option key={resource.name} value={resource.name}>
                            {resource.name} ({resource.value})
                          </option>
                        ))}
                      </Select>
                    </Box>

                    <Box mb="2rem" w="100%">
                      <StyledInput
                        type="number"
                        className="customInput"
                        placeholder="Enter amount of selected resource"
                        onChange={(e) => {
                          setProposal((prevState: { resources: any }) => {
                            const newResources = prevState.resources
                              ? [...prevState.resources]
                              : [];
                            const newAmount = parseInt(e.target.value);
                            if (isNaN(newAmount)) return prevState;
                            if (newResources.length === 0) return prevState;
                            else newResources[0].amount = newAmount;
                            return { ...prevState, resources: newResources };
                          });
                        }}
                      />
                    </Box>

                    <Box mb="2rem" w="100%">
                      <StyledInput
                        className="customInput"
                        placeholder="Enter amount of BONK"
                        onChange={(e) => {
                          setProposal({
                            ...proposal,
                            bonk: e.target.value,
                          });
                        }}
                      />
                    </Box>
                  </Stack>
                )}

                {proposalType === "MINT" && (
                  <Box mb="2rem" w="100%">
                    <StyledInput
                      fontWeight="500"
                      className="customInput"
                      placeholder="Enter new shares to mint"
                      onChange={(e) => {
                        setProposal({
                          type: "MINT",
                          newSharesToMint: e.target.value,
                        });
                      }}
                    />
                  </Box>
                )}

                {proposalType === "ALLOCATE" && (
                  <Stack spacing={4} w="100%">
                    <HStack alignItems="end" pr="1rem">
                      <ProposalLabel color={colors.brand.tertiary} pb="0.4rem">
                        unallocated voting power:
                      </ProposalLabel>
                      <Value>{unallocatedVotingPower}</Value>
                    </HStack>
                    <Select
                      fontWeight="500"
                      onChange={(e) =>
                        setProposal({
                          type: "ALLOCATE",
                          citizen: e.target.value,
                        })
                      }
                      placeholder="Select a citizen"
                    >
                      {factionData?.citizens?.map((citizen: Character) => (
                        <option key={citizen.mint} value={citizen.mint}>
                          {citizen.name}
                        </option>
                      ))}
                    </Select>
                    <Box mb="2rem">
                      <StyledInput
                        type="number"
                        onChange={(e) =>
                          setProposal({
                            type: "ALLOCATE",
                            amount: e.target.value,
                          })
                        }
                        placeholder="Enter amount of unallocated voting power to allocate"
                      />{" "}
                    </Box>
                  </Stack>
                )}

                {proposalType === "THRESHOLD" && (
                  <Box mb="2rem" w="100%">
                    <StyledInput
                      type="number"
                      onChange={(e) =>
                        setProposal({
                          type: "THRESHOLD",
                          newThreshold: e.target.value,
                        })
                      }
                      placeholder="Enter new threshold"
                    />{" "}
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
                        h="5rem"
                        fontSize="14px"
                        borderRadius="4px"
                        borderColor={colors.blacks[600]}
                        defaultValue={0}
                        min={0}
                        max={100}
                      />
                      <NumberInputStepper
                        pr="3rem"
                        borderColor={colors.blacks[600]}
                      >
                        <NumberIncrementStepper
                          fontSize="12px"
                          borderColor={colors.blacks[600]}
                          color={colors.brand.secondary}
                        />
                        <NumberDecrementStepper
                          fontSize="12px"
                          borderColor={colors.blacks[600]}
                          color={colors.brand.secondary}
                        />
                      </NumberInputStepper>
                    </NumberInput>
                  </Box>
                )}

                {proposalType === "BURN" && (
                  <Box mb="2rem" w="100%">
                    <Box mb="2rem" w="100%">
                      <Select
                        fontWeight="500"
                        className="customSelect"
                        placeholder="Select a resource"
                        onChange={(e) => {
                          setProposal((prevState: { resources: any }) => {
                            const newResources = prevState.resources
                              ? [...prevState.resources]
                              : [];
                            if (newResources.length === 0) {
                              newResources.push({
                                resourceName: e.target.value,
                                amount: 0,
                              });
                            } else {
                              newResources[0].resourceName = e.target.value;
                            }
                            return { ...prevState, resources: newResources };
                          });
                        }}
                      >
                        {factionData?.resources?.map((resource) => (
                          <option key={resource.name} value={resource.name}>
                            {resource.name} ({resource.value})
                          </option>
                        ))}
                      </Select>
                    </Box>

                    <Box mb="2rem" w="100%">
                      <StyledInput
                        type="number"
                        className="customInput"
                        placeholder="Enter amount of selected resource"
                        onChange={(e) => {
                          setProposal((prevState: { resources: any }) => {
                            const newResources = prevState.resources
                              ? [...prevState.resources]
                              : [];
                            const newAmount = parseInt(e.target.value);
                            if (isNaN(newAmount)) return prevState;
                            if (newResources.length === 0) return prevState;
                            else newResources[0].amount = newAmount;
                            return { ...prevState, resources: newResources };
                          });
                        }}
                      />
                    </Box>
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
              {isLoading ? <Spinner /> : "Create Proposal"}
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
  color: colors.brand.secondary,
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

export const ProposalLabel = styled(Text)`
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 0.6px;
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
