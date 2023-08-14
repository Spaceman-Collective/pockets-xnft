import { Text, Button, Flex, Box, Grid, HStack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import type { Character } from "@/types/server";
import { Frame } from "../wizard.components";
import { FC, ReactNode } from "react";
import { IconSkill } from "@/components/icons";
import { colors } from "@/styles/defaultTheme";

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
    "spellcasting",
    "shooting",
    "fighting",
    "strength",
    "healing",
    "psionics",
  ];

  const experienceKeys = Object.keys(data.experience) as Array<
    keyof typeof data.experience
  >;

  return (
    <Flex minH="60vh" direction="column" justifyContent="space-between">
      <Flex direction="column" gap="2rem">
        <Header name={data?.name} image={data?.image} faction={data?.faction} />
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="1rem">
          <SkillContainer>
            {data?.experience &&
              experienceKeys
                ?.filter((key) => !combatSkillKeys.includes(key.toLowerCase()))
                ?.sort((a, b) => a.localeCompare(b))
                .map((key) => (
                  <SkillBox
                    key={"noncombat" + key}
                    name={key}
                    level={data?.skills[key].toString()}
                    xp={
                      data.experience[key].current.toString() +
                      "/" +
                      data.experience[key].threshold.toString()
                    }
                  />
                ))}
          </SkillContainer>
          <SkillContainer isCombat>
            {experienceKeys
              ?.filter((key) => combatSkillKeys.includes(key.toLowerCase()))
              ?.sort((a, b) => a.localeCompare(b))
              .map((key) => (
                <SkillBox
                  key={"combat" + key}
                  name={key}
                  level={data?.skills[key].toString()}
                  xp={
                    data.experience[key].current.toString() +
                    "/" +
                    data.experience[key].threshold.toString()
                  }
                />
              ))}
          </SkillContainer>
        </Grid>
        <Flex gap="4rem">
          <Value>ARMY</Value>
          <HStack>
            <Label>Equipped</Label>
            <Value>123/456</Value>
          </HStack>
        </Flex>

        <Grid templateColumns="repeat(auto-fill,minmax(100px,1fr))">
          <TroopBox num={1} />
          <TroopBox num={2} />
          <TroopBox num={3} />
          <TroopBox />
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

const TroopBox = ({ num = 4 }: { num?: number }) => {
  const size = "100px";
  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      h={size}
      w={size}
      bg="brand.primary"
      p="0.5rem 1rem"
      borderRadius="0.5rem"
      backgroundImage={`mock/troop-${num}.png`}
      backgroundSize="110%"
      backgroundPosition="center"
      filter="drop-shadow(0 5px 0 rgba(0,0,0,0.0)) saturate(0.7)"
      transition="all 0.25s ease-in-out"
      _hover={{
        filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.9)) saturate(1.5)",
        transform: "scale(1.05)",
      }}
    >
      <Flex justifyContent="space-between">
        <Badge>10</Badge>
        <Badge>-</Badge>
      </Flex>

      <Flex justifyContent="space-between">
        <Badge>10</Badge>
        <Badge>+</Badge>
      </Flex>
    </Flex>
  );
};

const Badge = ({ children }: { children: ReactNode }) => {
  return (
    <Grid
      bg="black"
      placeItems="center"
      px="0.5rem"
      borderRadius="3px"
      opacity=".5"
      transition="all 0.25s ease-in-out"
      _hover={{
        opacity: "1",
      }}
    >
      <Text fontWeight={700} letterSpacing="1px" w="fit-content">
        {children}
      </Text>
    </Grid>
  );
};

const Header: FC<{ image: string; name: string; faction: any }> = ({
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

const SkillBox: FC<{ name: string; level: string; xp: string }> = ({
  name,
  level,
  xp,
}) => {
  const Icon = () => {
    function is(value: string) {
      return name.toLowerCase() === value.toLowerCase();
    }
    const style = {
      color: colors.brand.quternary,
      fontSize: "4rem",
    };
    return is("athlethics") ? (
      <IconSkill.athletics {...style} />
    ) : is("electronics") ? (
      <IconSkill.electronics {...style} />
    ) : is("farming") ? (
      <IconSkill.farming {...style} />
    ) : is("fighting") ? (
      <IconSkill.fighting {...style} />
    ) : is("forestry") ? (
      <IconSkill.forestry {...style} />
    ) : is("healing") ? (
      <IconSkill.healing {...style} />
    ) : is("manufacturing") ? (
      <IconSkill.manufacturing {...style} />
    ) : is("mining") ? (
      <IconSkill.mining {...style} />
    ) : is("psionics") ? (
      <IconSkill.psionics {...style} />
    ) : is("shooting") ? (
      <IconSkill.shooting {...style} />
    ) : is("spellcasting") ? (
      <IconSkill.spellcasting {...style} />
    ) : is("strength") ? (
      <IconSkill.strength {...style} />
    ) : (
      <div />
    );
  };

  return (
    <Flex
      bg="brand.primary"
      h="8rem"
      alignItems="center"
      gap="1rem"
      borderRadius="0.5rem"
      title={name}
      opacity={level === "0" ? "0.25" : "1"}
      _hover={{
        opacity: 1,
      }}
      transition="all 0.25s ease-in-out"
    >
      <Grid
        bg="blacks.500"
        h="6rem"
        w="6rem"
        ml="1rem"
        borderRadius="0.65rem"
        title={name}
        placeItems="center"
      >
        <Icon />
      </Grid>
      <Flex direction="column">
        <HStack>
          <Label>LVL:</Label>
          <Value>{level}</Value>
        </HStack>
        <HStack>
          <Label>XP:</Label>
          <Value>{xp}</Value>
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
