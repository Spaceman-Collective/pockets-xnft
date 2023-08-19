import { Character } from "@/types/server";
import { Label, PanelContainer, Value } from "../tab.styles";
import styled from "@emotion/styled";
import {
  Box,
  Flex,
  Grid,
  HStack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ModalStation } from "./station-modal.component";
import { FC } from "react";
import { useFaction } from "@/hooks/useFaction";

const stationSize = "7rem";

export const FactionTabServices: React.FC<{
  currentCharacter: Character;
  setFactionStatus: (value: boolean) => void;
}> = ({ currentCharacter, setFactionStatus }) => {
  const stationDisclosure = useDisclosure();

  return (
    <>
      <ModalStation
        isOpen={stationDisclosure.isOpen}
        onClose={stationDisclosure.onClose}
      />
      <PanelContainer display="flex" flexDirection="column">
        <HeaderStats
          factionName={currentCharacter.faction?.name}
          description={currentCharacter?.faction?.description}
        />
        <Grid
          bg="blacks.700"
          p="1.5rem"
          gap="1rem"
          borderRadius="0 1rem 1rem 1rem"
          templateColumns={`repeat(auto-fill, minmax(${stationSize}, 1fr))`}
          templateRows={stationSize}
        >
          {Array.from({ length: 32 }).map((_, i) =>
            i < 18 ? (
              <Station
                key={i + "station"}
                onClick={() => {
                  console.log("station: " + i);
                  stationDisclosure.onOpen();
                }}
              />
            ) : (
              <Box
                key={"dsadadsad" + i}
                bg="brand.primary"
                h={stationSize}
                w={stationSize}
                onClick={stationDisclosure.onOpen}
              />
            ),
          )}
        </Grid>
      </PanelContainer>
    </>
  );
};

const HeaderStats: React.FC<{
  factionName: string | undefined;
  description: string | undefined;
}> = ({ factionName, description }) => {
  return (
    <Flex mt="2rem" w="100%">
      <TownHall />
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="start"
        w="100%"
        p="1rem 1.5rem"
        flexGrow={1}
      >
        <VStack alignItems="start">
          <Title>{factionName}</Title>
          <Text noOfLines={3} textOverflow="ellipsis">
            {description}
          </Text>
        </VStack>
        <HStack alignSelf="end" justifySelf="end" gap="2rem">
          <Flex alignItems="center" gap="0.5rem">
            <Label>Level</Label>
            <Value>12</Value>
          </Flex>
          <Flex alignItems="center" gap="0.5rem">
            <Label>Population</Label>
            <Value>12</Value>
          </Flex>
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
      h={size + "rem"}
      w={size + 6 + "rem"} // adjust for padding removed from bottom
      p="1.5rem 1.5rem 0"
      justifySelf="start"
      borderRadius="1rem 1rem 0 0"
      alignSelf="end"
    >
      <Station
        onClick={() => {
          console.log("townhall coming soon");
        }}
      />
    </Box>
  );
};

const Station: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      minH={stationSize}
      minW={stationSize}
      w="100%"
      h="100%"
      bg="red"
      borderRadius="1rem"
      backgroundImage="https://picsum.photos/200"
      backgroundSize="cover"
      backgroundPosition="center"
      transition="all 0.25s ease-in-out"
      _hover={{
        transform: "scale(1.2)",
      }}
    />
  );
};

const Title = styled(Text)`
  text-transform: uppercase;
  font-size: 3rem;
  font-weight: 700;
`;
