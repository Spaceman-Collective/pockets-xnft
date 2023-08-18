import { Character } from "@/types/server";
import { PanelContainer } from "./tab.styles";
import styled from "@emotion/styled";
import { Flex, Text } from "@chakra-ui/react";

export const FactionTabServices: React.FC<{  currentCharacter: Character; setFactionStatus: (value: boolean) => void; }> = ({ currentCharacter, setFactionStatus }) => {
  return (
    <PanelContainer display="flex" flexDirection="column" gap="4rem">
      <Header factionName={currentCharacter?.faction?.name}/>
      <Text>hjkdsa</Text>
      <Text>hjkdsa</Text>
    </PanelContainer>
  );
};

const Header: React.FC<{factionName: string | undefined }> = ({ factionName })  => {
  return (
    <Flex justifyContent="space-between" alignItems="end">
      <Title verticalAlign="end">{factionName!}</Title>
    </Flex>
  );
};

const Title = styled(Text)`
  text-transform: uppercase;
  font-size: 3rem;
  font-weight: 700;
`;
