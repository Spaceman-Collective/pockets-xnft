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
import { Tip } from "@/components/tooltip";

const stationSize = "7rem";

export const FactionTabServices: React.FC<{
  currentCharacter: Character;
  setFactionStatus: (value: boolean) => void;
}> = ({ currentCharacter, setFactionStatus }) => {
  const stationDisclosure = useDisclosure();
  const { data: factionData } = useFaction({
    factionId: currentCharacter?.faction?.id ?? "",
  });
  console.log({ factionData });

  const availableSlots = factionData?.faction?.townhallLevel;
  const remainingSlots =
    availableSlots && availableSlots - factionData?.stations.length;

  return (
    <>
      <ModalStation
        isOpen={stationDisclosure.isOpen}
        onClose={stationDisclosure.onClose}
      />
      <PanelContainer display="flex" flexDirection="column">
        <HeaderStats
          factionName={currentCharacter.faction?.name}
          factionImage={currentCharacter?.faction?.image}
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
          {factionData?.stations?.map((station, i) => (
            <Station
              key={station.id}
              onClick={() => {
                stationDisclosure.onOpen();
              }}
            />
          ))}
          {remainingSlots &&
            remainingSlots > 0 &&
            Array.from({ length: remainingSlots }).map((_, i) => (
              <Tip
                key={"emptystation" + i}
                label={`Townhall Level ${availableSlots}: You have ${remainingSlots}/${availableSlots} remaining station slots`}
              >
                <Box
                  bg="brand.primary"
                  h={stationSize}
                  w={stationSize}
                  onClick={stationDisclosure.onOpen}
                />
              </Tip>
            ))}
        </Grid>
      </PanelContainer>
    </>
  );
};

const HeaderStats: React.FC<{
  factionName: string | undefined;
  factionImage: string | undefined;
  description: string | undefined;
}> = ({ factionName, factionImage, description }) => {
  return (
    <Flex mt="2rem" w="100%">
      <TownHall image={factionImage ?? ""} />
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

const TownHall: FC<{ image: string }> = ({ image }) => {
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
        image={image}
        onClick={() => {
          console.info("townhall coming soon");
        }}
      />
    </Box>
  );
};

const Station: FC<{ image?: string; onClick: () => void }> = ({
  image,
  onClick,
}) => {
  return (
    <Box
      onClick={onClick}
      minH={stationSize}
      minW={stationSize}
      w="100%"
      h="100%"
      bg="red"
      borderRadius="1rem"
      backgroundImage={image ?? "https://picsum.photos/200"}
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
