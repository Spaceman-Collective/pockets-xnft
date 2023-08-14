import {
  Text,
  Button,
  Flex,
  Box,
  Grid,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { Equipment } from "./equipment.component";
import styled from "@emotion/styled";
import type { Character } from "@/types/server";
import { Frame } from "../wizard.components";
import { FC, ReactNode } from "react";

export const ReviewMint = ({
  back: backStep,
  data,
}: {
  back: () => void;
  data?: Character;
}) => {
  console.log({ data });
  if (!data)
    return (
      <Button
        variant="outline"
        w="fit-content"
        onClick={() => {
          backStep();
        }}
      >
        Go back to NFTs
      </Button>
    );

  const combatSkillKeys = [
    "fighting",
    "healing",
    "psionics",
    "shooting",
    "spellcasting",
    "strength",
  ];
  return (
    <Flex minH="60vh" direction="column" justifyContent="space-between">
      <Flex direction="column" gap="2rem">
        <Header {...data} />
        <Grid templateColumns="1fr 1fr" gap="1rem">
          <SkillContainer>
            <SkillBox />
            <SkillBox />
          </SkillContainer>
          <SkillContainer isCombat>
            <SkillBox />
            <SkillBox />
            <SkillBox />
            <SkillBox />
            <SkillBox />
          </SkillContainer>
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

const Header: FC<{ image: string; name: string; faction: string }> = ({
  image,
  name,
  faction,
}) => {
  return (
    <Flex gap="1rem" alignItems="end">
      <Frame img={image} />
      <Box>
        <Text fontFamily="header" fontSize="5rem" fontWeight={700}>
          {name}
        </Text>
        <Flex gap="1rem" alignItems="center">
          <Text letterSpacing="1px">FACTION:</Text>
          {faction ? (
            <Text>{faction}</Text>
          ) : (
            <Button fontSize="1rem">Join Faction</Button>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

const SkillContainer: FC<{ children: ReactNode; isCombat?: boolean }> = ({
  children,
  isCombat,
}) => {
  return (
    <Box>
      <Value>{!isCombat && "NON-"}Combat Skills</Value>
      <Grid templateColumns="1fr 1fr" gap="1rem">
        {children}
      </Grid>
    </Box>
  );
};

const SkillBox = () => {
  return (
    <Flex
      bg="brand.primary"
      h="8rem"
      alignItems="center"
      gap="1rem"
      borderRadius="0.5rem"
    >
      <Grid
        bg="blacks.500"
        h="6rem"
        w="6rem"
        ml="1rem"
        borderRadius="0.65rem"
      />
      <Flex direction="column">
        <HStack>
          <Label>LVL:</Label>
          <Value>87</Value>
        </HStack>
        <HStack>
          <Label>XP:</Label>
          <Value>87</Value>
        </HStack>
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
