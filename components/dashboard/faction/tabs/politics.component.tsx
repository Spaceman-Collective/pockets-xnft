import {
  Box,
  Flex,
  HStack,
  Button,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { Label, PanelContainer, Value, ValueCalculation } from "./tab.styles";
import { colors } from "@/styles/defaultTheme";
import styled from "@emotion/styled";
import { useSolana } from "@/hooks/useSolana";
import { LeaveFactionModal } from "../leave-faction.component";
import { Character } from "@/types/server";
import { useEffect } from "react";
import { CreateProposal } from "../create-proposal-modal/create-proposal.component";

const spacing = "1rem";
export const FactionTabPolitics: React.FC<{
  currentCharacter: Character;
  setFactionStatus: (value: boolean) => void;
  fire?: () => void;
}> = ({ currentCharacter, setFactionStatus, fire: fireConfetti }) => {
  const {
    connection,
    walletAddress,
    signTransaction,
    buildMemoIx,
    encodeTransaction,
  } = useSolana();

  useEffect(() => {
    setFactionStatus(!!currentCharacter?.faction);
  }, [currentCharacter, setFactionStatus]);

  return (
    <PanelContainer display="flex" flexDirection="column" gap="4rem">
      <Header factionName={currentCharacter?.faction?.name} />
      <Flex>
        <CitizensButton
          onClick={() => {}}
          cursor="pointer"
          _hover={{
            bg: colors.blacks[700],
            borderColor: colors.blacks[700],
          }}
        >
          citizens
        </CitizensButton>
        <LeaveFactionModal
          character={currentCharacter}
          setFactionStatus={setFactionStatus}
        />
      </Flex>
      <VStack gap={spacing}>
        <ProposalLabels fire={fireConfetti} />
        {Array.from({ length: 3 }).map((_, i) => (
          <ProposalAction key={"res" + i}>
            <ProposalTitle>PROPOSAL #{i + 1}</ProposalTitle>
          </ProposalAction>
        ))}
      </VStack>
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
  fire?: () => void;
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
      <HStack gap="4rem" alignItems="end">
        <CreateProposal />
      </HStack>
    </Flex>
  );
};

const CitizensButton = styled(Button)`
  background-color: ${colors.brand.tertiary};
  border: 2px solid ${colors.brand.tertiary};
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

const ProposalTitle = styled(Text)`
  text-transform: uppercase;
  font-size: 1.75rem;
  font-weight: 800;
  font-spacing: 3px;
`;

const MenuTitle = styled(Text)`
  font-size: 1.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: underline;
`;
const MenuText = styled(Text)`
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ProposalAction = styled(Flex)`
  background-color: ${colors.blacks[500]};
  width: 100%;
  padding: 1.5rem;
  border-radius: ${spacing};
  align-items: center;
  justify-content: space-between;
`;
