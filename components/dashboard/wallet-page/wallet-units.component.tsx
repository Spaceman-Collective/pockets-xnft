import { Frame } from "@/components/wizard/wizard.components";
import { Faction, UNIT_TEMPLATES, Unit } from "@/types/server";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Spinner,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { FC, ReactNode, useEffect, useState } from "react";
import { Label, Value } from "./wallet-page.styles";
import { useSolana } from "@/hooks/useSolana";
import styled from "@emotion/styled";

export const WalletUnitPanel: FC<{ isLoading: boolean; units: any[] }> = ({
  isLoading,
  units,
}) => {
  console.log({ units });
  const [MOCK_UNITS, setMockUnits] = useState<Unit[]>([]);

  useEffect(() => {
    if (MOCK_UNITS.length == 0) {
      generateMockUnits(50).then((units: any) => {
        setMockUnits(units);
      });
    }
  }, []);

  const counts = countDuplicates(MOCK_UNITS);

  const uniqueUnits = MOCK_UNITS.filter(
    (unit, index, self) =>
      index === self.findIndex((t) => t.name === unit.name),
  );

  if (isLoading) {
    return (
      <VStack gap={"1rem"} align="center">
        <LoadingContainer>
          <Spinner size="lg" color="white" />
          <LoadingText>LOADING</LoadingText>
        </LoadingContainer>
      </VStack>
    );
  }

  return (
    <Flex minH="60vh" direction="column" justifyContent="space-between">
      <Flex direction="column">
        <Flex gap="4rem">
          <Value style={{ textDecoration: "underline" }}>ARMY</Value>
          {/* <HStack>
            <Label>unequipped</Label>
            <Value>123/456</Value>
          </HStack> */}
        </Flex>
        <Grid templateColumns="repeat(auto-fill,minmax(100px,1fr))">
          {uniqueUnits.map((unit, index) => (
            <TroopBox key={index} unit={unit} count={counts[unit.name]} />
          ))}
        </Grid>
      </Flex>
    </Flex>
  );
};
interface TroopBoxProps {
  unit: Unit;
  count: number;
}

const TroopBox: FC<TroopBoxProps> = ({ unit, count }) => {
  const size = "100px";

  const tooltipInfo = `
  Name: ${unit.name}
  Skill: ${unit.skill}
  Bonus: ${Object.entries(unit.bonus)
    .map(([enemy, bonusValue]) => `${enemy}: ${bonusValue}`)
    .join(", ")}
`.trim();

  return (
    <Tooltip
      label={tooltipInfo}
      fontSize="md"
      placement="top"
      whiteSpace="pre-line"
    >
      <Flex
        direction="column"
        justifyContent="space-between"
        h={size}
        w={size}
        mt="1rem"
        bg="brand.primary"
        p="0.5rem 1rem"
        borderRadius="0.5rem"
        backgroundImage={`url(${unit.image})`}
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
          <Badge>{count}</Badge>
        </Flex>
        <Flex justifyContent="space-between"></Flex>
      </Flex>
    </Tooltip>
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

function countDuplicates(units: Unit[]) {
  const countMap: { [name: string]: number } = {};
  units.forEach((unit) => {
    countMap[unit.name] = Math.floor(Math.random() * 4) + 1;
    // countMap[unit.name] = (countMap[unit.name] || 0) + 1;
  });
  return countMap;
}

const generateMockUnits = (count: number): Promise<Unit[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const shuffledTemplates = shuffleArray([
        ...UNIT_TEMPLATES,
        ...UNIT_TEMPLATES.slice(0, 2),
      ]);
      const allocations = generateRandomAllocation(
        shuffledTemplates.length,
        count,
      );
      const units: Unit[] = [];

      shuffledTemplates.forEach((template, i) => {
        for (let j = 0; j < allocations[i]; j++) {
          units.push({
            assetId: `unit_${units.length}`,
            name: template.name,
            image: template.image,
            skill: template.skill,
            bonus: generateRandomBonus(),
            mint: "AF93fJxEvN8GBVyPZY3RVfbpv6gieTeP4fZ7Rt9zdcpA",
          });
        }
      });

      resolve(units);
    }, 3000);
  });
};

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const generateRandomAllocation = (numUnits: number, totalCount: number) => {
  let remaining = totalCount - numUnits;
  const allocations: number[] = Array(numUnits).fill(1);

  for (let i = 0; i < numUnits - 1; i++) {
    if (remaining <= 0) break;
    const allocate = Math.floor(Math.random() * (remaining + 1));
    allocations[i] += allocate;
    remaining -= allocate;
  }
  allocations[numUnits - 1] += remaining;

  return allocations;
};

const generateRandomBonus = (): { [enemyName: string]: number } => {
  const enemies = [
    "Brawler",
    "Blademaster",
    "Gunner",
    "Ranger",
    "Mindbreaker",
    "Wizard",
  ];
  const bonusCount = Math.floor(Math.random() * (enemies.length + 1));
  const bonus: { [enemyName: string]: number } = {};

  for (let i = 0; i < bonusCount; i++) {
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    bonus[enemy] = Math.floor(Math.random() * 11);
  }

  return bonus;
};

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingText = styled.div`
  color: white;
  font-weight: 800;
  font-size: 12px;
  margin-top: 8px;
`;
