import { Character } from "@/types/server";
import { PanelContainer } from "./tab.styles";
import styled from "@emotion/styled";
import { Flex, Text } from "@chakra-ui/react";

export const FactionTabServices: React.FC<{  currentCharacter: Character }> = ({ currentCharacter }) => {
  return (
    <PanelContainer display="flex" flexDirection="column" gap="4rem">
      <Header />
      <Text>hjkdsa</Text>
      <Text>hjkdsa</Text>
    </PanelContainer>
  );
};

const Header = () => {
  return (
    <Flex justifyContent="space-between" alignItems="end">
      <Title verticalAlign="end">Mad OGs</Title>
    </Flex>
  );
};

const Title = styled(Text)`
  text-transform: uppercase;
  font-size: 3rem;
  font-weight: 700;
`;
