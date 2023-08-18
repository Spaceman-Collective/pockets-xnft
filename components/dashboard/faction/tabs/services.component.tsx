import { Character } from "@/types/server";
import { Label, PanelContainer, Value } from "./tab.styles";
import styled from "@emotion/styled";
import { Box, Flex, Grid, HStack, Text, VStack } from "@chakra-ui/react";

const stationSize = "7rem";

export const FactionTabServices: React.FC<{
  currentCharacter: Character;
  setFactionStatus: (value: boolean) => void;
}> = ({ currentCharacter, setFactionStatus }) => {
  return (
    <PanelContainer display="flex" flexDirection="column" gap="1rem">
      {/* <Header factionName={currentCharacter?.faction?.name} /> */}
      <ServicesGrid />
    </PanelContainer>
  );
};

const Header: React.FC<{ factionName: string | undefined }> = ({
  factionName,
}) => {
  return <Title verticalAlign="end">{factionName}</Title>;
};

const HeaderStats = () => {
  return (
    <Flex mt="2rem" pr="1rem" w="100%" justifyContent="space-between">
      <TownHall />
      <Flex direction="column" justifyContent="space-between" alignItems="end">
        <Title verticalAlign="end">{"faction name"}</Title>
        <HStack alignItems="end" justifySelf="end" pb="2rem" gap="1rem">
          <Label>Level</Label>
          <Value>12</Value>
          <Label>Population</Label>
          <Value>12</Value>
        </HStack>
      </Flex>
    </Flex>
  );
};

const TownHall = () => {
  const size = 17;
  return (
    <Box
      bg="blacks.700"
      minH={size + "rem"}
      w={size + 1.5 + "rem"} // adjust for padding removed from bottom
      p="1.5rem 1.5rem 0"
      justifySelf="start"
      borderRadius="1rem 1rem 0 0"
      alignItems="end"
    >
      <Station />
    </Box>
  );
};
const ServicesGrid = () => {
  return (
    <Box>
      <HeaderStats />
      <Grid
        bg="blacks.700"
        p="3rem"
        gap="1rem"
        borderRadius="0 1rem 1rem 1rem"
        templateColumns={`repeat(auto-fill, minmax(${stationSize}, 1fr))`}
        templateRows={stationSize}
      >
        {Array.from({ length: 50 }).map((_, i) =>
          true ? (
            <Station key={i + "station"} />
          ) : (
            <Box
              key={"dsadadsad" + i}
              bg="brand.primary"
              h={stationSize}
              w={stationSize}
            />
          ),
        )}
      </Grid>
    </Box>
  );
};

const Station = () => {
  return (
    <Box
      minH={stationSize}
      minW={stationSize}
      w="100%"
      h="100%"
      bg="red"
      borderRadius="1rem"
      backgroundImage="https://picsum.photos/200"
      backgroundSize="cover"
      backgroundPosition="center"
    />
  );
};

const Title = styled(Text)`
  text-transform: uppercase;
  font-size: 3rem;
  font-weight: 700;
`;
