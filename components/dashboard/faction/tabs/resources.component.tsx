import { Box, Flex, Grid, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { Label, PanelContainer, Value } from "./tab.styles";
import styled from "@emotion/styled";
import { colors } from "@/styles/defaultTheme";

const spacing = "1rem";
export const FactionTabResources = () => {
  return (
    <PanelContainer display="flex" flexDirection="column" gap="4rem">
      <Header />
      <VStack gap={spacing}>
        <ResourceLabels />
        <ResourceAction>hjkl</ResourceAction>
        <ResourceAction>hjkl</ResourceAction>
        <ResourceAction>hjkl</ResourceAction>
      </VStack>
      <Box>
        <Flex justifyContent="space-between" alignItems="end" mb="1rem">
          <MenuTitle mb="1rem">Treasury</MenuTitle>
          <Input
            bg="blacks.500"
            outline="none"
            placeholder="Search Items"
            p="0.5rem 2rem"
            borderRadius="1rem"
            opacity="0.5"
          />
        </Flex>
        <Grid
          templateColumns="repeat(auto-fit, minmax(100px,1fr))"
          gap={spacing}
        >
          {Array.from({ length: 222 }).map((_, i) => (
            <Flex
              key={i}
              bg="blacks.500"
              minH="5rem"
              alignItems="center"
              justifyContent="space-between"
              p="1rem"
              borderRadius="1rem"
              transition="all 0.25s ease-in-out"
              _hover={{
                filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.25))",
                transform: "scale(1.05)",
              }}
            >
              <Box
                h="4rem"
                w="4rem"
                bg="brand.primary"
                borderRadius="0.5rem"
                backgroundImage={`https://picsum.photos/seed/${i * 2}/32`}
              />
              <Value pr="1rem">78</Value>
            </Flex>
          ))}
        </Grid>
      </Box>
    </PanelContainer>
  );
};

const Header = () => {
  return (
    <Flex justifyContent="space-between" alignItems="end">
      <Title verticalAlign="end">Mad OGs</Title>
      <HStack alignItems="end">
        <Label>RF Prospect Cost:</Label>
        <Value>10k BONK</Value>
      </HStack>
      <HStack alignItems="end">
        <Label>Tax Rate</Label>
        <Value>10%</Value>
      </HStack>
    </Flex>
  );
};

const ResourceLabels = () => {
  return (
    <Flex justifyContent="space-between" alignItems="end" mb={spacing} w="100%">
      <MenuTitle>resource fields</MenuTitle>
      <HStack gap="4rem" alignItems="end">
        <MenuText color="brand.quaternary">harvest all</MenuText>
        <MenuText color="brand.tertiary">discover</MenuText>
      </HStack>
    </Flex>
  );
};

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
const MenuText = styled(Text)`
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;
const ResourceAction = styled(Flex)`
  background-color: ${colors.blacks[500]};
  width: 100%;
  padding: 1.5rem;
  border-radius: ${spacing};
`;
