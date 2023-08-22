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
import { Character } from "@/types/server";
import { useEffect, useState } from "react";
import { CreateProposal } from "../create-proposal-modal/create-proposal.component";
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
import { useCitizen } from "@/hooks/useCitizen";
import { LeaveFactionModal } from "../leave-faction.component";
import toast from "react-hot-toast";
import useProcessProposal from "@/hooks/useProcessProposal";
import { useProposalVotes } from "@/hooks/useProposalVotes";

const spacing = "1rem";
type FactionTabPoliticsProps = {
  currentCharacter: Character;
  setFactionStatus: (value: boolean) => void;
  fire: () => void;
};

export const FactionTabPolitics: React.FC<FactionTabPoliticsProps> = ({
  currentCharacter,
  setFactionStatus,
  fire: fireConfetti,
}) => {
  const factionId = currentCharacter?.faction?.id ?? "";

  const { data: factionData } = useFaction({
    factionId: currentCharacter?.faction?.id ?? "",
  });

  const {
    data: allProposals,
    isLoading: allProposalsIsLoading,
    isError,
  } = useFetchProposalsByFaction(factionId, 0, 50);

  useEffect(() => {
    if (factionData) {
      console.info("faction data politics: ", factionData);
    }
  }, [factionData]);

  useEffect(() => {
    setFactionStatus(!!currentCharacter?.faction);
    console.info("ap: ", allProposals);
  }, [currentCharacter, allProposals, setFactionStatus]);

  const renderContent = () => {
    if (allProposalsIsLoading || isError) {
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
        <ProposalLabels fire={fireConfetti} character={currentCharacter} />
        {allProposals?.proposals?.map((proposal: Proposal) => (
          <ProposalItem
            key={proposal.id}
            proposal={proposal}
            currentCharacter={currentCharacter}
          />
        ))}
      </VStack>
    );
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
      {renderContent()}
    </PanelContainer>
  );
};

type ProposalItemProps = {
  proposal: Proposal;
  currentCharacter: Character;
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
}) => {
  const { id: proposalId, type } = proposal;
  const [isVoteInProgress, setIsVoteInProgress] = useState<boolean>(false);
  const [localVote, setLocalVote] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [voteAmount, setVoteAmount] = useState<string>("");
  const [voteThreshold, setVoteThreshold] = useState<string>("");
  const { connection, walletAddress, signTransaction, encodeTransaction } =
    useSolana();

  const getProposalVotes = async () => {
    const propPDA = getProposalPDA(proposalId!);
    const citiPDA = getCitizenPDA(new PublicKey(currentCharacter?.mint));
    const votePDA = getVotePDA(citiPDA, propPDA);
    const vA = await getVoteAccount(connection, votePDA);

    if (vA) {
      console.log("VA: ", vA);
      setVoteAmount(vA.voteAmt.toString());
    } else {
      setVoteAmount("0");
    }
  };
  const { data: proposalVotes } = useProposalVotes(proposalId!);

  useEffect(() => {
    console.log(`votes for ${proposalId}: `, proposalVotes);

    setVoteAmount(proposalVotes);
    // if (proposalVotes && voteAmount == "") {
    // }
  }, [proposalId, proposalVotes, voteAmount]);

  const getVoteThreshold = async () => {
    if (!currentCharacter?.faction?.id) {
      console.error("Character undefined on vote threshold retrieval");
      return;
    }
    const factPDA = getFactionPDA(currentCharacter?.faction?.id);
    const fA = await getFactionAccount(connection, factPDA);

    if (fA) {
      console.log("FA: ", fA);
      setVoteThreshold(fA?.thresholdToPass.toString()!);
    } else {
      console.error("FA does not exist");
      setVoteThreshold("NA");
    }
  };

  useEffect(() => {
    getVoteThreshold().then(() => {
      console.log("Vote threshold: ", voteThreshold);
    });
  });

  // const getProposalOnChainInfo = async () => {
  //   const pA = await getProposalAccount(connection, proposalId!);

  //   if (pA) {
  //     console.log('proposalAccount: ', pA)
  //     // setVoteAmount(vA.voteAmt.toString());
  //   } else {
  //     setVoteAmount("0");
  //   }
  // };

  // useEffect(() => {
  //   // if (proposalAccount == "") {
  //     getProposalOnChainInfo().then(() => {
  //       // console.log("proposal status: ", proposalAccount.status);
  //     });
  //   //}
  // });

  const validateInput = (): boolean => {
    const isValid = !!localVote.trim() && !isNaN(parseInt(localVote));
    setInputError(isValid ? null : "Invalid vote input");
    return isValid;
  };

  const handleVote = async (votingAmt: number) => {
    setIsVoteInProgress(true);
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
          currentCharacter?.faction?.id!
        ),
      ],
    });

    if (typeof encodedSignedTx === "string") {
      const sig = await connection.sendRawTransaction(decode(encodedSignedTx));
      console.log("vote sig: sig");
      toast.success("Vote successful!");
    } else {
      toast.error("Vote failed!");
    }
    setLocalVote("");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsVoteInProgress(false);
  };

  const updateVote = async (votingAmt: number) => {
    setIsVoteInProgress(true);
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
          true
        ),
      ],
    });

    if (typeof encodedSignedTx === "string") {
      const sig = await connection.sendRawTransaction(decode(encodedSignedTx));
      console.log("update vot sig: ", sig);
      toast.success("Update vote successful!");
    }

    setLocalVote("");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsVoteInProgress(false);
  };

  const processProposalMutation = useProcessProposal(proposal?.id);

  return (
    <ProposalAction>
      <Flex width="100%" flexDirection="column">
        <Flex justifyContent="space-between" mb="2rem">
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
            <ProposalTitle>
              {voteAmount}/{voteThreshold}
            </ProposalTitle>
          </HStack>
        </Flex>

        <HStack alignItems="end" mb="14">
          <Label color={colors.brand.tertiary} pb="0.25rem">
            proposal id:
          </Label>
          <Value>{proposalId}</Value>
        </HStack>

        <Flex width="100%">
          {isVoteInProgress ? (
            <HStack gap={spacing}>
              <Flex>
                <Spinner size="md" color="white" />
                <LoadingText>LOADING...</LoadingText>
              </Flex>
            </HStack>
          ) : (
            <>
              <StyledInput
                placeholder={
                  Number(voteAmount) > 0
                    ? "Update amount of voting power"
                    : "Enter amount of voting power"
                }
                value={localVote}
                onChange={(e) => setLocalVote(e.target.value)}
                isInvalid={!!inputError}
                disabled={
                  isVoteInProgress ||
                  Number(voteAmount) >= Number(voteThreshold)
                } // Disable if voteAmount exceeds threshold
              />
              {inputError && <Text color="red.500">{inputError}</Text>}
              <Button
                ml="2rem"
                letterSpacing="1px"
                bg={colors.blacks[700]}
                onClick={() => {
                  if (Number(voteAmount) >= Number(voteThreshold)) {
                    processProposalMutation.mutate();
                  } else if (validateInput() && Number(voteAmount) > 0) {
                    updateVote(parseInt(localVote));
                  } else {
                    handleVote(parseInt(localVote));
                  }
                }}
                disabled={isVoteInProgress}
              >
                {Number(voteAmount) >= Number(voteThreshold)
                  ? "process"
                  : Number(voteAmount) > 0
                  ? "update"
                  : "vote"}
              </Button>
            </>
          )}
        </Flex>
        {isVoteInProgress ? (
          <Text>LOADING...</Text>
        ) : (
          <>
            <StyledInput
              placeholder={
                Number(voteAmount) > 0
                  ? "Update amount of voting power"
                  : "Enter amount of voting power"
              }
              value={localVote}
              onChange={(e) => setLocalVote(e.target.value)}
              isInvalid={!!inputError}
              disabled={
                isVoteInProgress || Number(voteAmount) > Number(voteThreshold)
              } // Disable if voteAmount exceeds threshold
            />
            {inputError && <Text color="red.500">{inputError}</Text>}
            <Button
              ml="2rem"
              letterSpacing="1px"
              bg={colors.blacks[700]}
              onClick={() => {
                if (Number(voteAmount) >= Number(voteThreshold)) {
                  processProposalMutation.mutate();
                } else if (validateInput() && Number(voteAmount) > 0) {
                  updateVote(parseInt(localVote));
                } else {
                  handleVote(parseInt(localVote));
                }
              }}
              disabled={isVoteInProgress}
            >
              {Number(voteAmount) >= Number(voteThreshold)
                ? "process"
                : Number(voteAmount) > 0
                ? "update"
                : "vote"}
            </Button>
          </>
        )}
      </Flex>
    </ProposalAction>
  );
};

const ProposalLabels: React.FC<{
  fire: () => void;
  character: Character;
}> = ({ fire: fireConfetti, character }) => {
  const [votingPower, setVotingPower] = useState<string>("");

  const { data } = useCitizen(character?.mint);
  const { connection, walletAddress, signTransaction, encodeTransaction } =
    useSolana();

  const getVotingPower = async () => {
    // if (vpA) {
    //   setVotingPower(vpA.votingPower.toString());
    // } else {
    //   setVotingPower("0");
    // }
  };

  useEffect(() => {
    getVotingPower().then(() => {
      console.log("Votes: ", votingPower);
      console.log("Inital Page Load Vote Count:  ", votingPower);
    });
  });

  return (
    <Flex justifyContent="space-between" alignItems="end" mb={spacing} w="100%">
      <MenuTitle>proposals</MenuTitle>
      <HStack alignItems="end">
        <Label color={colors.brand.tertiary} pb="0.25rem">
          Voting Power:
        </Label>
        <Value>
          {data?.citizen?.maxPledgedVotingPower
            ? new BN(data?.citizen?.maxPledgedVotingPower).toString()
            : "0"}
          /
          {data?.citizen?.totalVotingPower
            ? new BN(data?.citizen?.totalVotingPower).toString()
            : "0"}
        </Value>
        <ValueCalculation
          color={colors.brand.tertiary}
          pl="0.25rem"
          pb="0.25rem"
        >
          ({data?.citizen?.grantedVotingPower.toString()}
          {" + "}
          {data?.citizen?.maxPledgedVotingPower.toString()})
        </ValueCalculation>
      </HStack>
      <Flex alignItems="end">
        <CreateProposal fire={fireConfetti} />
      </Flex>
    </Flex>
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
