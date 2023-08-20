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
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Proposal, ProposalType } from "@/types/server";
import { colors } from "@/styles/defaultTheme";
import { BLUEPRINTS } from "../tabs/services-tab/constants";
import { Resource } from "@/types/server/Resources";
import { useFaction } from "@/hooks/useFaction";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";

export const ProposalForm: React.FC = () => {
  const [proposalType, setProposalType] = useState<ProposalType | null>(null);
  const [proposalData, setProposalData] = useState<Proposal>({
    id: "",
    type: "BUILD",
  });

  const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter();
  const { data: factionData, isLoading: factionIsLoading } = useFaction({
    factionId: selectedCharacter?.faction?.id ?? "",
  });

  const handleProposalTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setProposalType(event.target.value as ProposalType);
  };

  useEffect(() => {
    console.log("sc: ", selectedCharacter?.faction?.id);
  }, [selectedCharacter?.faction?.id]);

  const renderDynamicFields = () => {
    switch (proposalType) {
      case "BUILD":
        return (
          <FormControl>
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
          </FormControl>
        );

      case "UPGRADE":
        return (
          <FormControl>
            <StyledInput
              value={proposalData.stationId || ""}
              onChange={(e) =>
                setProposalData({ ...proposalData, stationId: e.target.value })
              }
              disabled={true}
              placeholder="Enter station ID or Townhall"
            />
          </FormControl>
        );

      case "ATK_CITY":
        return (
          <FormControl>
            <StyledInput
              value={proposalData.factionId || ""}
              onChange={(e) =>
                setProposalData({ ...proposalData, factionId: e.target.value })
              }
              disabled={true}
              placeholder="Enter faction ID"
            />
          </FormControl>
        );

      case "ATK_RF":
        return (
          <FormControl>
            <StyledInput
              value={proposalData.rfId || ""}
              onChange={(e) =>
                setProposalData({ ...proposalData, rfId: e.target.value })
              }
              disabled={true}
              placeholder="Enter resource field ID"
            />
          </FormControl>
        );

      case "WITHDRAW":
        return (
          <Fragment>
            <FormControl>
              <Select
                fontWeight="500"
                value={proposalData.citizen || ""}
                onChange={(e) =>
                  setProposalData({ ...proposalData, citizen: e.target.value })
                }
                placeholder="Select a citizen"
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
                value={
                  proposalData.resources && proposalData.resources[0]
                    ? proposalData.resources[0].resourceName
                    : ""
                }
                onChange={(e) => {
                  setProposalData((prevState) => {
                    if (prevState.resources && prevState.resources.length > 0) {
                      const newResources = [...prevState.resources];
                      newResources[0].resourceName = e.target.value;
                      return { ...prevState, resources: newResources };
                    }
                    return prevState;
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
            </FormControl>

            {proposalData.resources &&
            proposalData.resources[0] &&
            proposalData.resources[0].resourceName ? (
              <FormControl>
                <StyledInput
                  type="number"
                  value={
                    (proposalData.resources &&
                      proposalData.resources[0]?.amount) ||
                    ""
                  }
                  onChange={(e) =>
                    setProposalData((prevState) => {
                      if (
                        prevState.resources &&
                        prevState.resources.length > 0
                      ) {
                        const newResources = [...prevState.resources];
                        newResources[0].amount = parseInt(e.target.value);
                        return { ...prevState, resources: newResources };
                      }
                      return prevState;
                    })
                  }
                  placeholder="Enter amount of selected resource"
                />
              </FormControl>
            ) : null}

            <FormControl>
              <StyledInput
                value={proposalData.bonk || ""}
                onChange={(e) =>
                  setProposalData({ ...proposalData, bonk: e.target.value })
                }
                placeholder="Enter amount of BONK"
              />
            </FormControl>
          </Fragment>
        );

      case "MINT":
        return (
          <FormControl>
            <StyledInput
              value={proposalData.newSharesToMint || ""}
              onChange={(e) =>
                setProposalData({
                  ...proposalData,
                  newSharesToMint: e.target.value,
                })
              }
              disabled={true}
              placeholder="Enter amount of new shares to mint"
            />
          </FormControl>
        );

        case "ALLOCATE":
            return (
              <Fragment>
                <FormControl>
                  <Select
                    fontWeight="500"
                    value={proposalData.citizen || ""}
                    onChange={(e) =>
                      setProposalData({ ...proposalData, citizen: e.target.value })
                    }
                    placeholder="Select a citizen"
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
                    value={
                      proposalData.resources && proposalData.resources[0]
                        ? proposalData.resources[0].resourceName
                        : ""
                    }
                    onChange={(e) => {
                      setProposalData((prevState) => {
                        if (prevState.resources && prevState.resources.length > 0) {
                          const newResources = [...prevState.resources];
                          newResources[0].resourceName = e.target.value;
                          return { ...prevState, resources: newResources };
                        }
                        return prevState;
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
                </FormControl>
    
                {proposalData.resources &&
                proposalData.resources[0] &&
                proposalData.resources[0].resourceName ? (
                  <FormControl>
                    <StyledInput
                      type="number"
                      value={(proposalData.resources && proposalData.resources[0]?.amount) || ""}
                      onChange={(e) =>
                        setProposalData((prevState) => {
                          if (prevState.resources && prevState.resources.length > 0) {
                            const newResources = [...prevState.resources];
                            newResources[0].amount = parseInt(e.target.value);
                            return { ...prevState, resources: newResources };
                          }
                          return prevState;
                        })
                      }
                      placeholder="Enter amount of selected resource"
                    />
                  </FormControl>
                ) : null}
              </Fragment>
            );
    
        return (
          <Fragment>
            <FormControl>
              <StyledInput
                value={proposalData.citizen || ""}
                onChange={(e) =>
                  setProposalData({ ...proposalData, citizen: e.target.value })
                }
                placeholder="Select citizen"
              />
            </FormControl>

            <FormControl>
              <Select
                fontWeight="500"
                value={
                  proposalData.resources && proposalData.resources[0]
                    ? proposalData.resources[0].resourceName
                    : ""
                }
                onChange={(e) => {
                  setProposalData((prevState) => {
                    if (prevState.resources && prevState.resources.length > 0) {
                      const newResources = [...prevState.resources];
                      newResources[0].resourceName = e.target.value;
                      return { ...prevState, resources: newResources };
                    }
                    return prevState;
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
            </FormControl>

            {proposalData.resources &&
            proposalData.resources[0] &&
            proposalData.resources[0].resourceName ? (
              <FormControl>
                <StyledInput
                  type="number"
                  value={
                    (proposalData.resources &&
                      proposalData.resources[0]?.amount) ||
                    ""
                  }
                  onChange={(e) =>
                    setProposalData((prevState) => {
                      if (
                        prevState.resources &&
                        prevState.resources.length > 0
                      ) {
                        const newResources = [...prevState.resources];
                        newResources[0].amount = parseInt(e.target.value);
                        return { ...prevState, resources: newResources };
                      }
                      return prevState;
                    })
                  }
                  placeholder="Enter amount of selected resource"
                />
              </FormControl>
            ) : null}
          </Fragment>
        );

      case "THRESHOLD":
        return (
          <FormControl>
            <StyledInput
              value={proposalData.newThreshold || ""}
              onChange={(e) =>
                setProposalData({
                  ...proposalData,
                  newThreshold: e.target.value,
                })
              }
              placeholder="Enter threshold"
            />
          </FormControl>
        );

      case "WARBAND":
        return (
          <FormControl>
            <Textarea
              value={(proposalData.warband || []).join(", ")}
              onChange={(e) =>
                setProposalData({
                  ...proposalData,
                  warband: e.target.value.split(", "),
                })
              }
              placeholder="Enter warband, separated by commas"
            />
          </FormControl>
        );

      case "TAX":
        return (
          <FormControl>
            <FormLabel>New Tax Rate</FormLabel>
            <NumberInput defaultValue={0} min={0}>
              <NumberInputField
                value={proposalData.newTaxRate || 0}
                onChange={(e) =>
                  setProposalData({
                    ...proposalData,
                    newTaxRate: parseFloat(e.target.value),
                  })
                }
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        );

      case "BURN":
        // TODO: Handle resources as dynamic list if there are multiple resources to burn
        return null;

      default:
        return null;
    }
  };

  const handleSubmit = () => {
    console.log(proposalData);
    // Handle form submission here
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
              {type}
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

// Emotion styled component (just as an example)
const StyledBox = styled(Box)`
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  padding: 16px;
`;

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
