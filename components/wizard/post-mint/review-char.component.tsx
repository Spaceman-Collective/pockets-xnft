import { Text, Button, Flex, Box, Grid } from "@chakra-ui/react";
import { Equipment } from "./equipment.component";
import styled from "@emotion/styled";
import useLocalStorage from "use-local-storage";

import type { Character, NFT } from "@/types/server";
import { Frame } from "../wizard.components";

export const ReviewMint = ({
  back: backStep,
  data,
}: {
  back: () => void;
  data?: Character;
}) => {
  if (!data) return;
  return (
    <Flex minH="60vh" direction="column" justifyContent="space-between">
      <Flex direction="column" gap="2rem">
        <Flex gap="1rem">
          <Frame img={data.image} />
          <Box>
            <Text fontFamily="header" fontSize="5rem" fontWeight={700}>
              {data.name}
            </Text>
            <Flex gap="1rem" alignItems="center">
              <Text letterSpacing="1px">FACTION:</Text>
              {data?.faction ? (
                <Text>{data?.faction}</Text>
              ) : (
                <Button fontSize="1rem">Join Faction</Button>
              )}
            </Flex>
          </Box>
        </Flex>
        <Flex gap="1.5rem" direction={{ base: "column", md: "row" }}>
          <Equipment />
          <Flex
            w="100%"
            justifyContent="space-between"
            direction="column"
            gap={{ base: "1.5rem", md: "" }}
          >
            <Stat label="Health" value={data.vitals.health} />
            <Stat label="Spirit" value={data.vitals.spirit} />
            <Stat label="Weight" value={data.vitals.weight} suffix="KG" />
            <Grid templateColumns="repeat(2, 1fr)" gap="1.5rem">
              <Stat label="Dodge" value={data.vitals.dodge} />
              <Stat label="Parry" value={data.vitals.parry} />
              <Stat label="Magic Resist" value={data.vitals.magicResistance} />
              <Stat label="Armor" value={data.vitals.armor} />
            </Grid>
          </Flex>
        </Flex>
        <Flex w="100%" justifyContent="space-between">
          <Flex gap="5rem">
            <Value>Skills</Value>
            <Flex alignItems="end" gap="1rem">
              <Label>xp:</Label>
              <Value>
                {data?.experience.current}/{data?.experience.threshold}
              </Value>
            </Flex>
            <Flex alignItems="end" gap="1rem">
              <Label>points:</Label>
              <Value>{data.points}</Value>
            </Flex>
          </Flex>
          {/* <Label>See all {">"}</Label> */}
        </Flex>
        <Grid templateColumns="repeat(auto-fill, minmax(75px, 1fr))" gap="1rem">
          {(Object.keys(data.skills) as Array<keyof typeof data.skills>).map(
            (skill) => (
              <Box
                key={"skillbox:" + skill}
                p="1rem"
                w="75px"
                h="75px"
                bg="brand.primary"
                borderRadius="1rem"
                textTransform="uppercase"
                fontWeight={700}
                fontSize="1.25rem"
                opacity={data?.skills[skill] > 0 ? "1" : "0.3"}
                userSelect="none"
              >
                <Text
                  title={skill}
                  fontSize="1rem"
                  textOverflow="ellipsis"
                  noOfLines={1}
                  _hover={{
                    noOfLines: 2,
                  }}
                >
                  {skill}
                </Text>
                <Text fontSize="1.7rem" m="1rem auto" w="fit-content">
                  {data?.skills[skill]}
                </Text>
              </Box>
            )
          )}
        </Grid>
      </Flex>
      <Flex gap="2rem" mt="4rem">
        <Button
          variant="outline"
          w="100%"
          onClick={() => {
            backStep();
          }}
        >
          Mint another
        </Button>
        <Button w="100%">Continue</Button>
      </Flex>
    </Flex>
  );
};

const Stat = ({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) => {
  return (
    <Flex
      bg="brand.primary"
      p="1rem"
      borderRadius="0.5rem"
      gap="1rem"
      alignItems="end"
    >
      <Label>{label}:</Label>
      <Flex gap="0.5rem">
        <Value>{value}</Value>
        {suffix && (
          <Text letterSpacing="1px" fontWeight={600} fontSize="1.5rem">
            {suffix}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

const Label = styled(Text)`
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.5;
  font-weight: 400;
  font-size: 1.75rem;
`;

const Value = styled(Text)`
  font-weight: 700;
  font-size: 2rem;
  text-transform: uppercase;
`;
