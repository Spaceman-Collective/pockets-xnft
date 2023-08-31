import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Tooltip,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import { Label, PanelContainer, Value, ValueCalculation } from "../tab.styles";
import { colors } from "@/styles/defaultTheme";
import styled from "@emotion/styled";
import { useSolana } from "@/hooks/useSolana";
import { Character } from "@/types/server";
import { useEffect, useState } from "react";
import { CreateProposal } from "../../create-proposal-modal/create-proposal.component";
import { useFetchProposalsByFaction } from "@/hooks/useProposalsByFaction";
import { Proposal } from "@/types/server/Proposal";
import { FetchResponse } from "@/lib/apiClient";
import { useProposalAccount } from "@/hooks/useProposalAccount";
import {
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  getCitizenPDA,
  getFactionAccount,
  getFactionPDA,
  getProposalAccount,
  getProposalPDA,
  getVoteAccount,
  getVotePDA,
  updateVoteOnProposalIx,
  voteOnProposalIx,
} from "@/lib/solanaClient";
import { useProposalAccountServer } from "@/hooks/useProposalAccountServer";
import { BN } from "@coral-xyz/anchor";
import { useProposalVotesByCitizen } from "@/hooks/useProposalVotesByCitizen";
import { useFaction } from "@/hooks/useFaction";
import { decode } from "bs58";
import { TransactionMessage } from "@solana/web3.js";
import { useCitizen, CitizenAccountInfo } from "@/hooks/useCitizen";
import { LeaveFactionModal } from "../../leave-faction.component";
import toast from "react-hot-toast";
import { useProcessProposal } from "@/hooks/useProcessProposal";
import { useProposalVoteInfo } from "@/hooks/useProposalVoteInfo";
import { useVoteThreshold } from "@/hooks/useVoteThreshold";
import { useProposalVotesAll } from "@/hooks/useProposalVotesAll";
import { useQueryClient } from "@tanstack/react-query";
import { ToolTip } from "@/styles/brand-components";

const spacing = "1rem";
type FactionTabPoliticsProps = {
  currentCharacter: Character;
  setFactionStatus: (value: boolean) => void;
  fire: () => void;
  openCitizenModal: () => void;
};

export const FactionTabPolitics: React.FC<FactionTabPoliticsProps> = ({
  currentCharacter,
  setFactionStatus,
  fire: fireConfetti,
  openCitizenModal,
}) => {
  const factionId = currentCharacter?.faction?.id ?? "";
  const [isLoading, setIsLoading] = useState(false);
  const [voteThreshold, setVoteThreshold] = useState<string>("");
  const [votingPower, setVotingPower] = useState<string>("");
  const [proposalIds, setProposalIds] = useState<string[]>();

  const { data: factionData } = useFaction({ factionId });
  const { connection, walletAddress, signTransaction, encodeTransaction } =
    useSolana();

  const {
    data: allProposals,
    isLoading: allProposalsIsLoading,
    isError,
  } = useFetchProposalsByFaction(factionId, 0, 50);
  const { data: citizen, isLoading: isCitizenLoading } = useCitizen(
    currentCharacter?.mint,
    connection
  );
  const { data: vT, isLoading: isThresholdLoading } = useVoteThreshold(
    currentCharacter,
    connection,
  );
  const { data: votesData } = useProposalVotesAll(proposalIds);

  useEffect(() => {
    if (Array.isArray(allProposals) && !allProposalsIsLoading) {
      console.log("all proposals is: ", allProposals);
      setProposalIds(
        allProposals
          .map((proposal: Proposal) => proposal.id)
          .filter(Boolean) as string[],
      );
    }
  }, [allProposals, allProposalsIsLoading, votesData]);

  useEffect(() => {
    if (votesData) {
      if (typeof votesData === "string") {
        setVotingPower(votesData);
      } else if ("data" in votesData) {
        setVotingPower(votesData.data);
      }
    }
  }, [votesData]);

  useEffect(() => {
    if (vT && !isThresholdLoading) {
      setVoteThreshold(vT);
    }
  }, [isThresholdLoading, vT]);

  useEffect(() => {
    setFactionStatus(!!currentCharacter?.faction);
  }, [currentCharacter, allProposals, setFactionStatus]);

  const sortedProposals = allProposals?.proposals?.slice().sort((a, b) => {
    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });

  const fetchVotesForProposal = async (proposalId: string) => {
    const propPDA = getProposalPDA(proposalId);
    const citiPDA = getCitizenPDA(new PublicKey(currentCharacter?.mint!));
    const votePDA = getVotePDA(citiPDA, propPDA);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const vA = await getVoteAccount(connection, votePDA);
    console.log("proposalVotes voteAccount: ", vA);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return vA ? parseInt(vA.voteAmt.toString(), 10) : 0;
  };

  const updateVote = async (votingAmt: number, currentProposalId: string) => {
    let isIncrement = true;
    let normalizedVotingAmt = votingAmt;

    try {
      if (votingAmt < 0) {
        isIncrement = false;
        normalizedVotingAmt *= -1;
      }
      const encodedSignedTx = await encodeTransaction({
        walletAddress,
        connection,
        signTransaction,
        txInstructions: [
          await updateVoteOnProposalIx(
            connection,
            new PublicKey(walletAddress!),
            new PublicKey(currentCharacter?.mint!),
            currentProposalId!,
            votingAmt,
            currentCharacter?.faction?.id!,
            isIncrement,
          ),
        ],
      });

      if (typeof encodedSignedTx === "string") {
        const sig = await connection.sendRawTransaction(
          decode(encodedSignedTx),
        );
        toast.success("Update vote successful!");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (e) {
      console.error("Update failed: ", e);
    }
  };

  const reclaimProposalVotes = async () => {
    setIsLoading(true);
    if (!proposalIds || proposalIds.length === 0) {
      console.log("No proposals to fetch votes for");
      setIsLoading(false);
      return;
    }
    const voteAmounts = await Promise.all(
      proposalIds.map(fetchVotesForProposal),
    );

    for (let i = 0; i < proposalIds.length; i++) {
      const proposalId = proposalIds[i];
      const voteAmount = voteAmounts[i];

      if (voteAmount > 0) {
        await updateVote(-voteAmount, proposalId);
      }
    }

    console.log("All votes reclaimed!");
    setIsLoading(false);
  };

  useEffect(() => { }, [factionData, currentCharacter?.faction]);

  const renderContent = () => {
    if (isLoading || allProposalsIsLoading || isError) {
      return (
        <VStack gap={spacing} align="center">
          <LoadingContainer>
            <Spinner size="lg" color="white" />
            <LoadingText>LOADING</LoadingText>
          </LoadingContainer>
        </VStack>
      );
    }
    return (
      <VStack gap={spacing}>
        <Flex
          justifyContent="space-between"
          alignItems="end"
          mb={spacing}
          w="100%"
        >
          <MenuTitle>proposals</MenuTitle>
          <Flex alignItems="end">
            <Text
              fontSize="1.5rem"
              color="brand.secondary"
              cursor="pointer"
              onClick={reclaimProposalVotes}
            >
              RECLAIM PROPOSAL VOTES
            </Text>
          </Flex>
          <Flex alignItems="end">
            <CreateProposal
              currentCharacter={currentCharacter}
              fire={fireConfetti}
              factionData={factionData}
            />
          </Flex>
        </Flex>
        {allProposals.total === 0 ? (
          <ProposalAction>
            <Value>NO PROPOSALS CREATED</Value>
          </ProposalAction>
        ) : (
          sortedProposals?.map((proposal: Proposal) => (
            <ProposalItem
              key={proposal.id}
              proposal={proposal}
              currentCharacter={currentCharacter}
              voteThreshold={voteThreshold}
              setIsLoading={setIsLoading}
              connection={connection}
            />
          ))
        )}
      </VStack>
    );
  };

  return (
    <PanelContainer display="flex" flexDirection="column" gap="4rem">
      <Flex justifyContent="space-between">
        <Header factionName={currentCharacter?.faction?.name} />
        <Flex alignItems="end">
          {/* <Text
        fontSize="1.5rem"
        color="brand.secondary"
        cursor="pointer"
        onClick={reclaimAllVotes}
      >
        RECLAIM PROPOSAL VOTES
      </Text> */}
        </Flex>
        <HStack alignItems="end" pb="0.5rem">
          <Label color={colors.brand.tertiary} pb="0.25rem">
            Voting Power:
          </Label>
          {!isCitizenLoading ? (
            <>
              <Value>
                {Number(citizen?.totalVotingPower) -
                  Number(citizen?.maxPledgedVotingPower)}
              </Value>
              <ValueCalculation
                color={colors.brand.tertiary}
                pl="0.25rem"
                pb="0.25rem"
              >
                ({citizen?.grantedVotingPower.toString()}
                {" + "}
                {citizen?.delegatedVotingPower.toString()}
                {" - "}
                {citizen?.maxPledgedVotingPower.toString()})
              </ValueCalculation>
            </>
          ) : (
            <Spinner size="md" color="white" mb="0.5rem"  />
          )}
        </HStack>
      </Flex>

      <Flex>
        <CitizensButton onClick={openCitizenModal} cursor="pointer">
          citizens
        </CitizensButton>
        <LeaveFactionModal
          character={currentCharacter}
          setFactionStatus={setFactionStatus}
        />
      </Flex>
      {renderContent()}
    </PanelContainer>
  );
};

type ProposalItemProps = {
  proposal: Proposal;
  currentCharacter: Character;
  voteThreshold: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  connection: Connection;
};

enum ProposalStatus {
  VOTING = "VOTING",
  PASSED = "PASSED",
  CLOSED = "CLOSED",
}

type ProposalTypeDetailsProps = {
  type: string;
  proposal: any;
};

const ProposalTypeDetails: React.FC<ProposalTypeDetailsProps> = ({
  type,
  proposal,
}) => {
  return (
    <HStack alignItems="end" ml="5rem">
      <Label color={colors.brand.tertiary} pb="0.4rem">
        {getLabel(type)}:
      </Label>
      <ProposalTitle>
        {getValue(proposal?.type, proposal?.proposal)}
      </ProposalTitle>
    </HStack>
  );
};

const getLabel = (type: string) => {
  switch (type) {
    case "BUILD":
      return "Blueprint Name";
    case "UPGRADE":
      return "Station ID";
    case "ATK_CITY":
      return "Faction ID";
    case "ATK_RF":
      return "RF ID";
    case "WITHDRAW":
      return "Citizen";
    case "MINT":
      return "New Shares To Mint";
    case "ALLOCATE":
      return "Citizen";
    case "THRESHOLD":
      return "New Threshold";
    case "WARBAND":
      return "Warband";
    case "TAX":
      return "New Tax Rate";
    case "TAX":
      return "Burn Resources";
    default:
      return "";
  }
};

const getValue = (type: string, proposal: any) => {
  switch (type) {
    case "BUILD":
      return proposal.blueprintName;
    case "UPGRADE":
      return proposal.stationId;
    case "ATK_CITY":
      return proposal.factionId;
    case "ATK_RF":
      return proposal.rfId;
    case "WITHDRAW":
      return proposal.citizen;
    case "MINT":
      return proposal.newSharesToMint;
    case "ALLOCATE":
      return `${proposal.citizen} - Amount: ${proposal.amount}`;
    case "THRESHOLD":
      return proposal.newThreshold;
    case "WARBAND":
      return proposal.warband?.join(", ");
    case "TAX":
      return `${proposal.newTaxRate}%`;
    case "BURN":
      return `${proposal.resources}`;
    default:
      return "";
  }
};

const ProposalItem: React.FC<ProposalItemProps> = ({
  proposal,
  currentCharacter,
  voteThreshold,
  setIsLoading,
  connection,
}) => {
  const { id: proposalId, type } = proposal;
  const [isVoteInProgress, setIsVoteInProgress] = useState<boolean>(false);
  const [localVote, setLocalVote] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);

  const { walletAddress, signTransaction, encodeTransaction } = useSolana();

  const { data, isLoading: proposalVoteInfoIsLoading } = useProposalVoteInfo(
    proposalId!,
    connection!
  );
  const { voteAccountExists, totalVoteAmount, personalVoteAmount } = data;

  useEffect(() => {
    if (voteAccountExists) {
      console.log("tVA: ", totalVoteAmount);
      console.log("pVA: ", personalVoteAmount);
    }
  }, [personalVoteAmount, totalVoteAmount, voteAccountExists]);

  const validateInput = (): boolean => {
    const isValid = !!localVote.trim() && !isNaN(parseInt(localVote));
    setInputError(isValid ? null : "Invalid vote input");
    return isValid;
  };

  const queryClient = useQueryClient();

  const handleVote = async (votingAmt: number) => {
    setIsVoteInProgress(true);
    try {
      const encodedSignedTx = await encodeTransaction({
        walletAddress,
        connection,
        signTransaction,
        txInstructions: [
          await voteOnProposalIx(
            connection,
            new PublicKey(walletAddress!),
            new PublicKey(currentCharacter?.mint!),
            proposalId!,
            votingAmt,
            currentCharacter?.faction?.id!,
          ),
        ],
      });

      if (typeof encodedSignedTx === "string") {
        const sig = await connection.sendRawTransaction(
          decode(encodedSignedTx),
        );
        toast.success("Vote successful!");
      } else {
        toast.error("Vote failed!");
      }
      setLocalVote("");
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      // queryClient.refetchQueries(["proposalInfo"]);
      // queryClient.refetchQueries(["citizen", currentCharacter?.mint]).then(() => {
      //   setIsVoteInProgress(false);
      // });
      await new Promise((resolve) => setTimeout(resolve, 15000));

      queryClient.refetchQueries(["proposalInfo", proposalId]).then(() => {
        queryClient.refetchQueries({ queryKey: ["citizen"] }).then(() => {
          setIsVoteInProgress(false);
        })
      });

    } catch (e) {
      console.log("Vote failed: ", e);
      toast.error("Vote failed");
      setIsVoteInProgress(false);
    }
  };

  const updateVote = async (votingAmt: number) => {
    setIsVoteInProgress(true);
    let isIncrement = true;
    let normalizedVotingAmt = votingAmt;

    try {
      if (votingAmt < 0) {
        isIncrement = false;
        normalizedVotingAmt *= -1;
      }
      const encodedSignedTx = await encodeTransaction({
        walletAddress,
        connection,
        signTransaction,
        txInstructions: [
          await updateVoteOnProposalIx(
            connection,
            new PublicKey(walletAddress!),
            new PublicKey(currentCharacter?.mint!),
            proposalId!,
            votingAmt,
            currentCharacter?.faction?.id!,
            isIncrement,
          ),
        ],
      });

      if (typeof encodedSignedTx === "string") {
        const sig = await connection.sendRawTransaction(
          decode(encodedSignedTx),
        );
        toast.success("Update vote successful!");
      }

      setLocalVote("");
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      // queryClient.refetchQueries(["proposalInfo"]);
      // queryClient.refetchQueries(["citizen", currentCharacter?.mint]).then(() => {
      //   setIsVoteInProgress(false);
      // });
      await new Promise((resolve) => setTimeout(resolve, 15000));

      queryClient.refetchQueries(["proposalInfo", proposalId]).then(() => {
        queryClient.refetchQueries({ queryKey: ["citizen"] }).then(() => {
          setIsVoteInProgress(false);
        })
      });
    } catch (e) {
      console.log("Update failed: ", e);
      setIsVoteInProgress(false);
    }
  };

  const processProposalMutation = useProcessProposal(
    setIsLoading,
    proposal?.id,
  );

  return (
    <ProposalAction>
      <Flex width="100%" flexDirection="column">
        <Flex justifyContent="space-between" mb="1rem">
          <HStack alignItems="end" pr="5rem">
            <Label color={colors.brand.tertiary} pb="0.4rem">
              type:
            </Label>
            <ProposalTitle>{type}</ProposalTitle>
            <ProposalTypeDetails type={type} proposal={proposal} />
          </HStack>
          <HStack alignItems="end" pr="1rem">
            <Label color={colors.brand.tertiary} pb="0.4rem">
              votes:
            </Label>

            <VoteFlex>
              {personalVoteAmount &&
                !proposalVoteInfoIsLoading &&
                !isVoteInProgress ? (
                <Tooltip
                  label={`Your vote amount: ${personalVoteAmount}`}
                  aria-label="A tooltip"
                >
                  {totalVoteAmount}
                </Tooltip>
              ) : (
                <Spinner size="md" color="white" />
              )}
              /
              {voteThreshold ? (
                voteThreshold
              ) : (
                <Spinner size="md" color="white" />
              )}
            </VoteFlex>
          </HStack>
        </Flex>

        <HStack alignItems="end" mb="2rem">
          <Label color={colors.brand.tertiary} pb="0.25rem">
            proposal id:
          </Label>
          <Value style={{ textTransform: "lowercase" }}>{proposalId}</Value>
        </HStack>

        <Flex width="100%">
          {isVoteInProgress || proposalVoteInfoIsLoading ? (
            <HStack gap={spacing}>
              <Spinner size="md" color="white" />
              <LoadingText style={{ marginTop: "0px" }}>LOADING...</LoadingText>
            </HStack>
          ) : (
            <Box w="100%">
              <Flex flexDirection="row" w="100%">
                <StyledInput
                  placeholder={"Enter amount of voting power"}
                  value={localVote}
                  onChange={(e) => setLocalVote(e.target.value)}
                  isInvalid={!!inputError}
                  disabled={
                    isVoteInProgress ||
                    Number(totalVoteAmount) >= Number(voteThreshold)
                  }
                />
                <Button
                  ml="2rem"
                  letterSpacing="1px"
                  bg={colors.blacks[700]}
                  onClick={() => {
                    if (
                      voteAccountExists &&
                      Number(totalVoteAmount) >= Number(voteThreshold)
                    ) {
                      processProposalMutation.mutate();
                    } else if (validateInput() && voteAccountExists) {
                      updateVote(parseInt(localVote));
                    } else if (validateInput()) {
                      handleVote(parseInt(localVote));
                    }
                  }}
                  disabled={isVoteInProgress}
                >
                  {voteAccountExists &&
                    Number(totalVoteAmount) >= Number(voteThreshold)
                    ? "process"
                    : voteAccountExists
                      ? "add votes"
                      : "vote"}
                </Button>
              </Flex>
              {inputError && <Text color="red.500">{inputError}</Text>}
            </Box>
          )}
        </Flex>
      </Flex>
    </ProposalAction>
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

function handleError(error: Error | string) {
  console.error(error);
  const errorMessage = typeof error === "string" ? error : error.message;
  toast.error(errorMessage);
}

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

const VoteFlex = styled(Flex)`
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
