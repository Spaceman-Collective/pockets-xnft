import { useState, ChangeEvent, useRef, Fragment, useEffect } from "react";
import {
  Box,
  Select,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  HStack,
  FormErrorMessage,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Circle,
  Tooltip,
  SliderMark,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Character, Proposal, ProposalType } from "@/types/server";
import { colors } from "@/styles/defaultTheme";
import { BLUEPRINTS } from "../tabs/services-tab/constants";
import { Resource } from "@/types/server/Resources";
import { useFaction } from "@/hooks/useFaction";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";
import { Label, Value } from "../tabs/tab.styles";
import { useSolana } from "@/hooks/useSolana";
import toast from "react-hot-toast";
import { useCreateProposal } from "@/hooks/useCreateProposal";

export const ProposalForm: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const {
    connection,
    walletAddress,
    signTransaction,
    encodeTransaction,
    buildMemoIx,
  } = useSolana();

  const [proposalType, setProposalType] = useState<ProposalType | null>(null);
  const [proposalData, setProposalData] = useState<Proposal>({
    id: "",
    type: "BUILD",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [warbandCitizen1, setWarbandCitizen1] = useState<string | null>(null);
  const [warbandCitizen2, setWarbandCitizen2] = useState<string | null>(null);
  const [warbandCitizen3, setWarbandCitizen3] = useState<string | null>(null);
  const [unallocatedVotingPower, setUnallocatedVotingPower] =
    useState<string>("0");
  const [currentThreshold, setCurrentThreshold] = useState<string>("0");

  const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter();
  const factionId = selectedCharacter?.faction?.id;
  const { data: factionData, isLoading: factionIsLoading } = useFaction({
    factionId: factionId ?? "",
  });
  const { mutate } = useCreateProposal();

  const handleProposalTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setProposalType(event.target.value as ProposalType);
  };

  useEffect(() => {
    if (factionData) {
      console.log("fd: ", factionData);
      console.log("scf: ", selectedCharacter?.faction);
    }
  }, [factionData, selectedCharacter?.faction]);

  const renderDynamicFields = () => {
    const renderError = (key: string | number) => {
      return (
        errors[key] && (
          <FormErrorMessage color="red.500">{errors[key]}</FormErrorMessage>
        )
      );
    };

    switch (proposalType) {
      case "BUILD":
        return (
          <FormControl isInvalid={!!errors.blueprintName}>
            <Select
              fontWeight="500"
              value={proposalData.blueprintName || ""}
              onChange={(e) =>
                setProposalData({
                  ...proposalData,
                  blueprintName: e.target.value,
                })
              }
            >
              <option value="" disabled>
                Select Blueprint
              </option>
              {BLUEPRINTS.map((bp) => (
                <option key={bp.name} value={bp.name}>
                  {bp.name}
                </option>
              ))}
            </Select>
            {renderError("blueprintName")}
          </FormControl>
        );

      case "UPGRADE":
        return (
          <Fragment>
            <FormControl isInvalid={!!errors.stationId}>
              <Select
                fontWeight="500"
                value={proposalData.stationId || ""}
                onChange={(e) =>
                  setProposalData({
                    ...proposalData,
                    stationId: e.target.value,
                  })
                }
                placeholder="Select a station to upgrade"
              >
                {factionData?.stations?.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.blueprint} / current lvl: {station.level} / id:
                    {station.id}
                    {station.id}
                  </option>
                ))}
              </Select>
              {renderError("statiod")}
            </FormControl>
          </Fragment>
        );

      case "ATK_CITY":
        return (
          <FormControl isInvalid={!!errors.factionId}>
            <StyledInput
              value={proposalData.factionId || ""}
              onChange={(e) =>
                setProposalData({
                  ...proposalData,
                  factionId: e.target.value,
                })
              }
              disabled={true}
              placeholder="Enter faction ID"
            />
            {renderError("factionId")}
          </FormControl>
        );

      case "ATK_RF":
        return (
          <FormControl isInvalid={!!errors.rfId}>
            <StyledInput
              value={proposalData.rfId || ""}
              onChange={(e) =>
                setProposalData({
                  ...proposalData,
                  rfId: e.target.value,
                })
              }
              disabled={true}
              placeholder="Enter resource field ID"
            />
            {renderError("rfId")}
          </FormControl>
        );

      case "WITHDRAW":
        return (
          <Fragment>
            <FormControl isInvalid={!!errors.citizen}>
              <Select
                fontWeight="500"
                value={proposalData.citizen || ""}
                onChange={(e) =>
                  setProposalData({
                    ...proposalData,
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
              {renderError("citizen")}
            </FormControl>

            <FormControl isInvalid={!!errors.resourceName}>
              <Select
                fontWeight="500"
                value={
                  proposalData.resources && proposalData.resources[0]
                    ? proposalData.resources[0].resourceName
                    : ""
                }
                onChange={(e) => {
                  setProposalData((prevState) => {
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
                placeholder="Select a resource"
              >
                {factionData?.resources?.map((resource) => (
                  <option key={resource.name} value={resource.name}>
                    {resource.name} ({resource.value})
                  </option>
                ))}
              </Select>
              {renderError("resourceName")}
            </FormControl>

            {proposalData.resources &&
            proposalData.resources[0] &&
            proposalData.resources[0].resourceName ? (
              <FormControl isInvalid={!!errors.resourceAmount}>
                <StyledInput
                  type="number"
                  value={
                    (proposalData.resources &&
                      proposalData.resources[0]?.amount) ||
                    ""
                  }
                  onChange={(e) => {
                    setProposalData((prevState) => {
                      const newResources = prevState.resources
                        ? [...prevState.resources]
                        : [];
                      const newAmount = parseInt(e.target.value);
                      if (isNaN(newAmount)) return prevState;

                      if (newResources.length === 0) {
                        return prevState;
                      } else {
                        newResources[0].amount = newAmount;
                      }

                      return { ...prevState, resources: newResources };
                    });
                  }}
                  placeholder="Enter amount of selected resource"
                />
                {renderError("resourceAmount")}
              </FormControl>
            ) : null}

            <FormControl isInvalid={!!errors.bonk}>
              <StyledInput
                value={proposalData.bonk || ""}
                onChange={(e) =>
                  setProposalData({
                    ...proposalData,
                    bonk: e.target.value,
                  })
                }
                placeholder="Enter amount of BONK"
              />
              {renderError("bonk")}
            </FormControl>
          </Fragment>
        );

      case "MINT":
        return (
          <FormControl isInvalid={!!errors.newSharesToMint}>
            <StyledInput
              value={proposalData.newSharesToMint || ""}
              onChange={(e) =>
                setProposalData({
                  ...proposalData,
                  newSharesToMint: e.target.value,
                })
              }
              placeholder="Enter amount of new shares to mint"
            />
            {renderError("newSharesToMint")}
          </FormControl>
        );

      case "ALLOCATE":
        return (
          <Fragment>
            <HStack alignItems="end" pr="1rem">
              <Label color={colors.brand.tertiary} pb="0.4rem">
                unallocated voting power:
              </Label>
              <Value>{unallocatedVotingPower}</Value>
            </HStack>
            <FormControl isInvalid={!!errors.citizen}>
              <Select
                fontWeight="500"
                value={proposalData.citizen || ""}
                onChange={(e) =>
                  setProposalData({
                    ...proposalData,
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
              {renderError("citizen")}
            </FormControl>
            <FormControl isInvalid={!!errors.amount}>
              <StyledInput
                type="number"
                value={proposalData.amount || ""}
                onChange={(e) =>
                  setProposalData({
                    ...proposalData,
                    amount: e.target.value,
                  })
                }
                placeholder="Enter amount of unallocated voting power to allocate"
              />
              {renderError("amount")}
            </FormControl>
          </Fragment>
        );

      case "THRESHOLD":
        return (
          <FormControl isInvalid={!!errors.newThreshold}>
            <HStack alignItems="end" pr="1rem">
              <Label color={colors.brand.tertiary} pb="0.4rem">
                current threshold:
              </Label>
              <Value>{currentThreshold}</Value>
            </HStack>
            <StyledInput
              value={proposalData.newThreshold || ""}
              onChange={(e) =>
                setProposalData({
                  ...proposalData,
                  newThreshold: e.target.value,
                })
              }
              placeholder="Enter new proposal threshold"
            />
            {renderError("newThreshold")}
          </FormControl>
        );

      case "WARBAND":
        return (
          <Fragment>
            <FormControl>
              <Select
                fontWeight="500"
                value={warbandCitizen1 || ""}
                onChange={(e) => setWarbandCitizen1(e.target.value)}
                placeholder="Select Citizen 1"
                disabled={true}
                cursor="arrow"
              >
                {citizenMints.map((citizenMint) => (
                  <option key={citizenMint} value={citizenMint}>
                    {citizenMint}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <Select
                fontWeight="500"
                value={warbandCitizen2 || ""}
                onChange={(e) => setWarbandCitizen2(e.target.value)}
                placeholder="Select Citizen 2"
                disabled={true}
                cursor="arrow"
              >
                {citizenMints.map((citizenMint) => (
                  <option key={citizenMint} value={citizenMint}>
                    {citizenMint}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <Select
                fontWeight="500"
                value={warbandCitizen3 || ""}
                onChange={(e) => setWarbandCitizen3(e.target.value)}
                placeholder="Select Citizen 3"
                disabled={true}
                cursor="arrow"
              >
                {citizenMints.map((citizenMint) => (
                  <option key={citizenMint} value={citizenMint}>
                    {citizenMint}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Fragment>
        );

      case "TAX":
        return (
          <FormControl isInvalid={!!errors.newTaxRate}>
            <NumberInput defaultValue={0} min={0} max={100}>
              <NumberInputField
                value={`${proposalData.newTaxRate || 0}%`}
                onChange={(e) => {
                  const valueWithoutPercentage = parseFloat(
                    e.target.value.replace("%", "")
                  );
                  setProposalData({
                    ...proposalData,
                    newTaxRate: valueWithoutPercentage,
                  });
                }}
                {...inputStyles}
              />
              <NumberInputStepper mr={5}>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {renderError("newTaxRate")}
          </FormControl>
        );
      case "BURN":
        return (
          <Fragment>
            {/* Select a resource to burn */}
            <FormControl isInvalid={!!errors.resourceName}>
              <Select
                fontWeight="500"
                value={
                  proposalData.resources && proposalData.resources[0]
                    ? proposalData.resources[0].resourceName
                    : ""
                }
                onChange={(e) => {
                  setProposalData((prevState) => {
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
                placeholder="Select a resource to burn"
              >
                {factionData?.resources?.map((resource) => (
                  <option key={resource.name} value={resource.name}>
                    {resource.name} ({resource.value})
                  </option>
                ))}
              </Select>
              {renderError("resourceName")}
            </FormControl>

            {/* Specify the amount of the selected resource to burn */}
            {proposalData.resources &&
            proposalData.resources[0] &&
            proposalData.resources[0].resourceName ? (
              <FormControl isInvalid={!!errors.resourceAmount}>
                <StyledInput
                  type="number"
                  value={
                    (proposalData.resources &&
                      proposalData.resources[0]?.amount) ||
                    ""
                  }
                  onChange={(e) => {
                    setProposalData((prevState) => {
                      const newResources = prevState.resources
                        ? [...prevState.resources]
                        : [];
                      const newAmount = parseInt(e.target.value);
                      if (isNaN(newAmount)) return prevState;

                      if (newResources.length === 0) {
                        return prevState;
                      } else {
                        newResources[0].amount = newAmount;
                      }

                      return { ...prevState, resources: newResources };
                    });
                  }}
                  placeholder="Enter amount of resource to burn"
                />
                {renderError("resourceAmount")}
              </FormControl>
            ) : null}
          </Fragment>
        );

      default:
        return null;
    }
  };

  const validateInputs = () => {
    const errors: { [key: string]: string } = {};

    if (!proposalType) {
      errors.proposalType = "Proposal type is required!";
    }

    switch (proposalType) {
      case "BUILD":
        if (!proposalData.blueprintName) {
          errors.blueprintName = "Blueprint is required!";
        }
        break;

      case "UPGRADE":
        if (!proposalData.stationId) {
          errors.stationId = "Please select a station to upgrade!";
        }
        break;

      case "ATK_CITY":
        if (!proposalData.factionId) {
          errors.factionId = "Faction ID is required!";
        }
        break;

      case "ATK_RF":
        if (!proposalData.rfId) {
          errors.rfId = "Resource Field ID is required!";
        }
        break;

      case "WITHDRAW":
        if (!proposalData.citizen) {
          errors.citizen = "Citizen selection is required!";
        }
        if (!proposalData.resources || !proposalData.resources[0]) {
          errors.resources = "Resource selection is required!";
        }
        if (proposalData.resources && !proposalData.resources[0].amount) {
          errors.resourceAmount = "Resource amount is required!";
        }
        if (!proposalData.bonk) {
          errors.bonk = "BONK amount is required!";
        }
        break;

      case "MINT":
        if (!proposalData.newSharesToMint) {
          errors.newSharesToMint = "Amount of new shares to mint is required!";
        }
        break;

      case "ALLOCATE":
        if (!proposalData.citizen) {
          errors.citizen = "Citizen selection is required!";
        }
        if (!proposalData.resources || !proposalData.resources[0]) {
          errors.resources = "Resource selection is required!";
        }
        break;

      case "THRESHOLD":
        if (!proposalData.newThreshold) {
          errors.newThreshold = "Threshold is required!";
        }
        break;

      case "WARBAND":
        const selectedWarbandCitizens = [
          warbandCitizen1,
          warbandCitizen2,
          warbandCitizen3,
        ].filter(Boolean) as string[];
        if (selectedWarbandCitizens.length !== 3) {
          errors.warband =
            "Please select exactly three citizens for the warband!";
        } else {
          setProposalData({
            ...proposalData,
            warband: selectedWarbandCitizens,
          });
        }
        break;

      case "TAX":
        if (
          proposalData.newTaxRate === undefined ||
          proposalData.newTaxRate < 0 ||
          proposalData.newTaxRate > 100
        ) {
          errors.newTaxRate = "Valid tax rate is required!";
        }
        break;

      case "BURN":
        if (
          !proposalData.resources ||
          !proposalData.resources[0] ||
          !proposalData.resources[0].resourceName
        ) {
          errors.resourceName = "A resource must be selected!";
        }
        if (
          !proposalData.resources ||
          !proposalData.resources[0] ||
          typeof proposalData.resources[0].amount !== "number" ||
          proposalData.resources[0].amount <= 0
        ) {
          errors.resourceAmount = "A valid resource amount must be provided!";
        }
        break;

      default:
        break;
    }

    setErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  const handleSubmit = () => {
    if (!validateInputs()) {
      return;
    }
    handleCreateProposal();
    console.log(proposalData);
  };

  const onSuccess = () => {
    toast.success("Created proposal!");
    setProposalType(null);
    setProposalData({
      id: "",
      type: "BUILD",
    });
    setErrors({});
    setWarbandCitizen1(null);
    setWarbandCitizen2(null);
    setWarbandCitizen3(null);
    setUnallocatedVotingPower("0");
    setCurrentThreshold("0");
    onClose();
  };

  const handleCreateProposal = async () => {
    console.log('propoal data: ', proposalData);
    let prpsl: Proposal = {
      type: proposalData.type,
    };

    switch (proposalData.type) {
      case "TAX":
        prpsl.newTaxRate = proposalData.newTaxRate;
        break;
      case "BUILD":
        prpsl.blueprintName = proposalData.blueprintName;
        break;
      case "UPGRADE":
        prpsl.stationId = proposalData.stationId;
        break;
      case "ATK_CITY":
        prpsl.factionId = proposalData.factionId;
        break;
      case "ATK_RF":
        prpsl.rfId = proposalData.rfId;
        break;
      case "WITHDRAW":
        prpsl.citizen = proposalData.citizen;
        prpsl.resources = proposalData.resources;
        prpsl.bonk = proposalData.bonk;
        break;
      case "MINT":
        prpsl.newSharesToMint = proposalData.newSharesToMint;
        break;
      case "ALLOCATE":
        prpsl.citizen = proposalData.citizen;
        prpsl.amount = proposalData.amount;
        break;
      case "THRESHOLD":
        prpsl.newThreshold = proposalData.newThreshold;
        break;
      case "WARBAND":
        prpsl.warband = proposalData.warband;
        break;
      case "BURN":
        prpsl.resources = proposalData.resources;
        break;
      default:
        // You can throw an error or log here if an unexpected type is encountered
        console.error("Invalid proposal type:", proposalData.type);
        return;
    }

    console.log('propo: ', prpsl);

    const payload = {
      mint: selectedCharacter?.mint,
      timestamp: Date.now().toString(),
      proposal: prpsl,
    };
    console.log('py: ', payload);
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
      <FormControl>
        <Select
          onChange={handleProposalTypeChange}
          value={proposalType || ""}
          marginBottom="3rem"
        >
          <option value="" disabled>
            SELECT A PROPOSAL TYPE
          </option>
          {PROPOSAL_TYPES.map((type) => (
            <option key={type} value={type}>
              {PROPOSAL_DISPLAY_NAMES[type]}
            </option>
          ))}
        </Select>
      </FormControl>

      <Stack spacing={4} marginTop={4}>
        {renderDynamicFields()}
      </Stack>

      <CreateButton
        onClick={handleSubmit}
        _hover={{
          backgroundColor: colors.blacks[700],
          border: `2px solid ${colors.blacks[700]}`,
        }}
      >
        Create Proposal
      </CreateButton>
    </>
  );
};

const CreateButton = styled(Button)`
  background-color: ${colors.brand.quaternary};
  border: 2px solid ${colors.brand.quaternary};
  border-radius: 0.5rem;
  margin: 3rem 0rem 2rem 0rem;
  width: 100%;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: 1px;
`;

const PROPOSAL_TYPES: ProposalType[] = [
  "BUILD",
  "UPGRADE",
  "ATK_CITY",
  "ATK_RF",
  "WITHDRAW",
  "MINT",
  "ALLOCATE",
  "THRESHOLD",
  "WARBAND",
  "TAX",
  "BURN",
];

const PROPOSAL_DISPLAY_NAMES: Record<ProposalType, string> = {
  BUILD: "BUILD STATION",
  UPGRADE: "UPGRADE STATION",
  ATK_CITY: "ATTACK CITY",
  ATK_RF: "ATTACK RESOURCE FIELD",
  WITHDRAW: "WITHDRAW RESOURCES",
  MINT: "MINT NEW VOTING SHARES",
  ALLOCATE: "ALLOCATE VOTING POWER",
  THRESHOLD: "CHANGE VOTING THRESHOLD",
  WARBAND: "CREATE WARBAND",
  TAX: "SET TAX RATE",
  BURN: "BURN RESOURCES",
};

const citizenMints = [
  "CITZ-1234",
  "CITZ-1235",
  "CITZ-1236",
  "CITZ-1237",
  "CITZ-1238",
  "CITZ-1239",
  "CITZ-1240",
  "CITZ-1241",
  "CITZ-1242",
  "CITZ-1243",
];

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

const StyledInput = styled(Input)`
  ${inputStyles}

  &:disabled {
    background-color: ${colors.blacks[500]} !important;
  }
`;
