import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import { Label, PanelContainer, Value, ValueCalculation } from "./tab.styles";
import { colors } from "@/styles/defaultTheme";
import styled from "@emotion/styled";
import { useSolana } from "@/hooks/useSolana";
import { LeaveFactionModal } from "../leave-faction.component";
import { Character } from "@/types/server";
import { useEffect, useState } from "react";
import { CreateProposal } from "../create-proposal-modal/create-proposal.component";
import { useFetchProposalsByFaction } from "@/hooks/useFetchProposalsByFaction";
import { Proposal } from "@/types/Proposal";
import { FetchResponse } from "@/lib/apiClient";

const spacing = "1rem";
export const FactionTabPolitics: React.FC<{
  currentCharacter: Character;
  setFactionStatus: (value: boolean) => void;
  fire: () => void;
}> = ({ currentCharacter, setFactionStatus, fire: fireConfetti }) => {
  const [vote, setVote] = useState("");
  const [inputError, setInputError] = useState("");

  const {
    connection,
    walletAddress,
    signTransaction,
    buildMemoIx,
    encodeTransaction,
  } = useSolana();
  const {
    data: allProposals,
    isLoading: allProposalsIsLoading,
    isError,
  } = useFetchProposalsByFaction(currentCharacter?.faction!.id, 0, 10) as {
    data: FetchResponse | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  useEffect(() => {
    setFactionStatus(!!currentCharacter?.faction);
    console.log("c faction: ", currentCharacter?.faction);
  }, [currentCharacter, setFactionStatus]);

  useEffect(() => {
    console.log("ap: ", allProposals);
  }, [allProposals]);

  const validateInputs = () => {
    let errors = {
      vote: "",
    };

    let isValid = true;

    // BUILD
    if (!vote.trim()) {
      setInputError("Voting power is required to vote");
      isValid = false;
    }

    return isValid;
  };

  const handleVote = () => {

    
  };

  return (
    <PanelContainer display="flex" flexDirection="column" gap="4rem">
      <Header factionName={currentCharacter?.faction?.name} />
      <Flex>
        <CitizensButton onClick={() => {}} cursor="pointer">
          citizens
        </CitizensButton>
        <LeaveFactionModal
          character={currentCharacter}
          setFactionStatus={setFactionStatus}
        />
      </Flex>
      {allProposals ? (
        <VStack gap={spacing}>
          <ProposalLabels fire={fireConfetti} />
          {allProposals?.proposals?.map((proposal: Proposal, i: number) => (
            <ProposalAction key={"res" + i}>
              <Flex width="100%" flexDirection="column">
                <Flex justifyContent="space-between" mb="2rem">
  
                  <Flex>
                  <HStack alignItems="end" pr="5rem">
                      <Label color={colors.brand.tertiary} pb="0.4rem">
                        type:
                      </Label>
                      <ProposalTitle>{proposal.type}</ProposalTitle>
                    </HStack>
                                  {/* Conditional rendering based on proposal type */}
                {proposal.type === "BUILD" && (
                  <HStack alignItems="end">
                    <Label color={colors.brand.tertiary} pb="0.4rem">
                      Blueprint Name:
                    </Label>
                    <Value>{proposal.blueprintName}</Value>
                  </HStack>
                )}
                {proposal.type === "UPGRADE" && (
                  <HStack alignItems="end">
                    <Label color={colors.brand.tertiary} pb="0.4rem">
                      Station ID:{" "}
                    </Label>
                    <Value>{proposal.stationId}</Value>
                  </HStack>
                )}
                {proposal.type === "ATK_CITY" && (
                  <HStack alignItems="end">
                    <Label color={colors.brand.tertiary} pb="0.4rem">
                      Faction ID:{" "}
                    </Label>
                    <Value>{proposal.factionId}</Value>
                  </HStack>
                )}
                {proposal.type === "ATK_RF" && (
                  <HStack alignItems="end">
                    <Label color={colors.brand.tertiary} pb="0.4rem">
                      RF ID:{" "}
                    </Label>
                    <Value>{proposal.rfId}</Value>
                  </HStack>
                )}
                {proposal.type === "WITHDRAW" && (
                  <HStack alignItems="end">
                    <Label color={colors.brand.tertiary} pb="0.4rem">
                      Citizen:{" "}
                    </Label>
                    <Value>{proposal.citizen}</Value>
                    {/* Handle displaying the resources array */}
                  </HStack>
                )}
                {proposal.type === "MINT" && (
                  <HStack alignItems="end">
                    <Label color={colors.brand.tertiary} pb="0.4rem">
                      New Shares To Mint:{" "}
                    </Label>
                    <Value>{proposal.newSharesToMint}</Value>
                  </HStack>
                )}
                {proposal.type === "ALLOCATE" && (
                  <HStack alignItems="end">
                    <Label color={colors.brand.tertiary} pb="0.4rem">
                      Citizen:{" "}
                    </Label>
                    <Value>{proposal.citizen}</Value>
                    <Label color={colors.brand.tertiary} pb="0.4rem">
                      Amount:{" "}
                    </Label>
                    <Value>{proposal.amount}</Value>
                  </HStack>
                )}
                {proposal.type === "THRESHOLD" && (
                  <HStack alignItems="end">
                    <Label color={colors.brand.tertiary} pb="0.4rem">
                      New Threshold:{" "}
                    </Label>
                    <Value>{proposal.newThreshold}</Value>
                  </HStack>
                )}
                {proposal.type === "WARBAND" && (
                  <HStack alignItems="end">
                    <Label color={colors.brand.tertiary} pb="0.4rem">
                      Warband:
                    </Label>
                    <Value>{proposal.warband?.join(", ")}</Value>
                  </HStack>
                )}
                {proposal.type === "TAX" && (
                  <HStack alignItems="end">
                    <Label color={colors.brand.tertiary} pb="0.4rem">
                      New Tax Rate:{" "}
                    </Label>
                    <Value>{proposal.newTaxRate}</Value>
                  </HStack>
                )}
                  </Flex>
                  <HStack alignItems="end" pl="5rem">
                      <Label color={colors.brand.tertiary} pb="0.4rem">
                        votes:
                      </Label>
                      {proposal.newThreshold ? (
                        <Value>{proposal.newThreshold}</Value>
                      ) : (
                        <Value>0</Value>
                      )}
                    </HStack>
                </Flex>


                                  <HStack alignItems="end" mb="14">
                    <Label color={colors.brand.tertiary} pb="0.25rem">
                      proposal id:
                    </Label>
                    <Value>{proposal.id}</Value>
                  </HStack>
              </Flex>
              <Flex width="100%">
                <Flex width="100%">
                  <StyledInput
                    placeholder="Enter amount of voting power"
                    value={vote}
                    onChange={(e) => setVote(e.target.value)}
                    isInvalid={!!inputError}
                  />
                  {inputError && <Text color="red.500">{inputError}</Text>}
                </Flex>
                <Button ml="2rem" letterSpacing="1px" onClick={handleVote}>
                  vote
                </Button>
              </Flex>
            </ProposalAction>
          ))}
        </VStack>
      ) : (
        <VStack gap={spacing} align="center">
          <div style={{ color: "white" }}>
            <LoadingContainer>
              <Spinner size="lg" color="white" />
              <LoadingText>LOADING</LoadingText>
            </LoadingContainer>
          </div>
        </VStack>
      )}
    </PanelContainer>
  );
};

const Header: React.FC<{ factionName: string | undefined }> = ({
  factionName,
}) => {
  return (
    <Flex justifyContent="space-between" alignItems="end">
      <Title verticalAlign="end">{factionName!}</Title>
    </Flex>
  );
};

const ProposalLabels: React.FC<{
  fire: () => void;
}> = ({ fire: fireConfetti }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex justifyContent="space-between" alignItems="end" mb={spacing} w="100%">
      <MenuTitle>proposals</MenuTitle>
      <HStack alignItems="end">
        <Label color={colors.brand.tertiary} pb="0.25rem">
          Voting Power:
        </Label>
        <Value>40/40</Value>
        <ValueCalculation
          color={colors.brand.tertiary}
          pl="0.25rem"
          pb="0.25rem"
        >
          (30 + 10)
        </ValueCalculation>
      </HStack>
      <Flex alignItems="end">
        <CreateProposal fire={fireConfetti} />
      </Flex>
    </Flex>
  );
};

const CitizensButton = styled(Button)`
  border-radius: 0.5rem;
  margin: 0rem 3rem 0rem 0rem;
  width: 100%;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: 1px;
`;

const Title = styled(Text)`
  text-transform: uppercase;
  font-size: 3rem;
  font-weight: 700;
`;

const MenuTitle = styled(Text)`
  font-size: 1.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: underline;
`;

const ProposalTitle = styled(Text)`
  text-transform: uppercase;
  font-size: 2.25rem;
  font-weight: 800;
  font-spacing: 3px;
`;
const ProposalAction = styled(Flex)`
  background-color: ${colors.blacks[500]};
  width: 100%;
  padding: 1.5rem;
  border-radius: ${spacing};
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingText = styled.div`
  color: white;
  font-weight: 800;
  font-size: 12px;
  margin-top: 8px;
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

const StyledInput = styled(Input)`
  ${inputStyles}
`;
