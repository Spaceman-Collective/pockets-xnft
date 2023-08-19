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
import { useFetchProposalsByFaction } from "@/hooks/useProposalsByFaction";
import { Proposal } from "@/types/Proposal";
import { FetchResponse } from "@/lib/apiClient";
import { useProposalAccount } from "@/hooks/useProposalAccount";
import {
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { getProposalPDA, voteOnProposalIx } from "@/lib/solanaClient";
import { useProposalAccountServer } from "@/hooks/useProposalAccountServer";
import { BN } from "@coral-xyz/anchor";
import { useProposalVotesByCitizen } from "@/hooks/useProposalVotesByCitizen";
import { useFaction } from "@/hooks/useFaction";
import { decode } from "bs58";
import { TransactionMessage } from "@solana/web3.js";

const spacing = "1rem";
export const FactionTabPolitics: React.FC<{
  currentCharacter: Character;
  setFactionStatus: (value: boolean) => void;
  fire: () => void;
}> = ({ currentCharacter, setFactionStatus, fire: fireConfetti }) => {
  const { data: factionData } = useFaction({
    factionId: currentCharacter?.faction?.id ?? "",
  });
  console.log({ factionData });

  const {
    data: allProposals,
    isLoading: allProposalsIsLoading,
    isError,
    refetch,
  } = useFetchProposalsByFaction(currentCharacter?.faction!.id, 0, 10);

  useEffect(() => {
    setFactionStatus(!!currentCharacter?.faction);
  }, [currentCharacter, setFactionStatus]);

  useEffect(() => {
    console.info("ap: ", allProposals);
  }, [allProposals]);

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
      {allProposals && !allProposalsIsLoading && !isError ? (
        <VStack gap={spacing}>
          <ProposalLabels fire={fireConfetti} />
          {allProposals?.proposals?.map((proposal: Proposal) => (
            <ProposalItem key={proposal.id} proposal={proposal} currentCharacter={currentCharacter} />
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

type ProposalItemProps = {
  proposal: Proposal;
  currentCharacter: Character;
};

enum ProposalStatus {
  VOTING = "VOTING",
  PASSED = "PASSED",
  CLOSED = "CLOSED",
}

interface ProposalAccount {
  id: string;
  faction: string;
  voteAmt: number;
  status: ProposalStatus;
}

type ProposalTypeDetailsProps = {
  type: string;
  proposal: any;
};

const ProposalTypeDetails: React.FC<ProposalTypeDetailsProps> = ({ type, proposal }) => {
  return (
    <div>
      <Label color={colors.brand.tertiary} pb="0.4rem">
        {getLabel(type)}:
      </Label>
      <Value>{getValue(type, proposal)}</Value>
    </div>
  );
};

const getLabel = (type: string) => {
  switch (type) {
    case "BUILD": return "Blueprint Name";
    case "UPGRADE": return "Station ID";
    case "ATK_CITY": return "Faction ID";
    case "ATK_RF": return "RF ID";
    case "WITHDRAW": return "Citizen";
    case "MINT": return "New Shares To Mint";
    case "ALLOCATE": return "Citizen";
    case "THRESHOLD": return "New Threshold";
    case "WARBAND": return "Warband";
    case "TAX": return "New Tax Rate";
    default: return "";
  }
};

const getValue = (type: string, proposal: any) => {
  switch (type) {
    case "BUILD": return proposal.blueprintName;
    case "UPGRADE": return proposal.stationId;
    case "ATK_CITY": return proposal.factionId;
    case "ATK_RF": return proposal.rfId;
    case "WITHDRAW": return proposal.citizen;
    case "MINT": return proposal.newSharesToMint;
    case "ALLOCATE": return `${proposal.citizen} - Amount: ${proposal.amount}`; 
    case "THRESHOLD": return proposal.newThreshold;
    case "WARBAND": return proposal.warband?.join(", ");
    case "TAX": return proposal.newTaxRate;
    default: return "";
  }
};

export const ProposalItem: React.FC<ProposalItemProps> = ({ proposal, currentCharacter }) => {
  const { id: proposalId, type } = proposal;

  const [localVote, setLocalVote] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [voteMint, setVoteMint] = useState<string | null>(null);
  const [localProposalAccount, setLocalProposalAccount] = useState<ProposalAccount | null>(null);

  const { connection, walletAddress, signTransaction, encodeTransaction } = useSolana();

  const { data: proposalAccount, error, isLoading } = useProposalAccountServer(proposalId);
  const { data: voteData } = useProposalVotesByCitizen(
    { mint: voteMint ? voteMint.toString() : null, proposalId },
    !!voteMint
  );

    useEffect(() => {
      if (proposalAccount && !localProposalAccount) {
        setLocalProposalAccount({
          ...proposalAccount,
          voteAmt: new BN(proposalAccount.voteAmt).toNumber(),
        });
      }
    }, [localProposalAccount, proposalAccount]);
  
    if (isLoading) return <span>Loading...</span>;
    if (error) return <span>Error: {(error as Error).message}</span>;

    const validateInput = (): boolean => {
      const isValid = !!localVote.trim() && !isNaN(parseInt(localVote));
      setInputError(isValid ? null : "Invalid vote input");
      return isValid;
    };
    


  const handleVote = async (votingAmt: number, proposalId: string) => {
    const encodedSignedTx = await encodeTransaction({
      walletAddress,
      connection,
      signTransaction,
      txInstructions: [
        await voteOnProposalIx(
          new PublicKey(walletAddress!),
          new PublicKey(currentCharacter?.mint!),
          proposalId,
          votingAmt,
          currentCharacter?.faction?.id!
        ),
      ],
    });
    if (!encodedSignedTx) throw Error("No Vote Tx");
    try {
      const { blockhash } = await connection!.getLatestBlockhash();

      const txMsg = new TransactionMessage({
        payerKey: new PublicKey(walletAddress!),
        recentBlockhash: blockhash,
        instructions: [
          await voteOnProposalIx(
            new PublicKey(walletAddress!),
            new PublicKey(currentCharacter?.mint!),
            proposalId,
            votingAmt,
            currentCharacter?.faction?.id!
          ),
        ],
      }).compileToLegacyMessage();

      const tx = new VersionedTransaction(txMsg);
      const signedTx = await signTransaction(tx);
      console.log(await connection.simulateTransaction(signedTx));
    } catch (e) {
      console.log(e);
    }
    const sig = await connection.sendRawTransaction(decode(encodedSignedTx));

    console.log("sig", sig);

    const voteMint = getProposalPDA(proposalId);

    setVoteMint(voteMint.toString());

    console.log("voteMint: ", voteMint.toString());
    console.log('vote data: ', voteData)
  };


  return (
    <ProposalAction>
      <Flex width="100%" flexDirection="column">
        <Flex justifyContent="space-between" mb="2rem">
          <HStack alignItems="end" pr="5rem">
            <Label color={colors.brand.tertiary} pb="0.4rem">type:</Label>
            <ProposalTitle>{type}</ProposalTitle>
          </HStack>
          <ProposalTypeDetails type={type} proposal={proposal} />
          <HStack alignItems="end" pl="5rem">
            <Label color={colors.brand.tertiary} pb="0.4rem">votes:</Label>
            <Value>{localProposalAccount?.voteAmt}</Value>
          </HStack>
        </Flex>

        <HStack alignItems="end" mb="14">
          <Label color={colors.brand.tertiary} pb="0.25rem">proposal id:</Label>
          <Value>{proposalId}</Value>
        </HStack>

        <Flex width="100%">
          <StyledInput
            placeholder="Enter amount of voting power"
            value={localVote}
            onChange={(e) => setLocalVote(e.target.value)}
            isInvalid={!!inputError}
          />
          {inputError && <Text color="red.500">{inputError}</Text>}
          <Button
            ml="2rem"
            letterSpacing="1px"
            onClick={() => validateInput() && handleVote(parseInt(localVote), proposalId)}
          >
            vote
          </Button>
        </Flex>
      </Flex>
    </ProposalAction>
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

const Header: React.FC<{ factionName: string | undefined }> = ({
  factionName,
}) => {
  return (
    <Flex justifyContent="space-between" alignItems="end">
      <Title verticalAlign="end">{factionName!}</Title>
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
