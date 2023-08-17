import { Faction } from "@/types/server";
import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  joinFaction: () => void;
  faction: Faction,
}

export const FactionBox: FC<Props> = ({joinFaction, faction}: Props) => {
  return (
    <>
      <Flex
        bg="brand.primary"
        w="100%"
        h="13rem"
        borderRadius="0.5rem"
        alignItems="center"
        justifyContent="space-between"
        p="2rem"
      >
        <Flex gap="2rem" alignItems="center">
          <Box
            bg="blacks.500"
            h="10rem"
            w="10rem"
            backgroundImage={faction.image}
            backgroundPosition="center"
            backgroundSize="cover"
            borderRadius="0.5rem"
          />
          <Box>
            <Text textTransform="uppercase" fontSize="1.25rem">
              population{" "}
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "2rem",
                  marginLeft: "0.5rem",
                }}
              >
                {/* TODO - shouldn't we have faction pop in `faction` */}
                12
              </span>
            </Text>
            <Text textTransform="uppercase" fontSize="2.5rem" fontWeight={700}>
                {faction.name}
            </Text>
            <Text
              color="brand.tertiary"
              letterSpacing="0.25rem"
              textTransform="uppercase"
              fontSize="1.5rem"
              textDecor="underline"
            >
              {faction.external_link}
            </Text>
          </Box>
        </Flex>
        <Box>
          <Button onClick={joinFaction}>join</Button>
        </Box>
      </Flex>
    </>
  );
};
