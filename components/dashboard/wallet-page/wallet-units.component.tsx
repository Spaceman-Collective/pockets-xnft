import { NFT, UNIT_TEMPLATES, Unit } from "@/types/server";
import {
  Checkbox,
  CheckboxGroup,
  Flex,
  Grid,
  HStack,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { FC, ReactNode, useEffect, useState } from "react";
import { Value } from "./wallet-page.styles";
import styled from "@emotion/styled";
import { Tip } from "@/components/tooltip";

export const WalletUnitPanel: FC<{ isLoading: boolean; units: NFT[] }> = ({
  isLoading,
  units,
}) => {
  const [showStack, setShowStack] = useState(true);
  return (
    <Flex minH="60vh" direction="column" justifyContent="space-between">
      <Flex direction="column">
        <Flex mb="1rem" justifyContent="space-between">
          <Value style={{ textDecoration: "underline" }}>ARMY</Value>
          <HStack
            onClick={() => setShowStack(!showStack)}
            cursor="pointer"
            userSelect="none"
          >
            <Text>{showStack ? "Unstack Items" : "Stack Items"}</Text>
            <Checkbox size="lg" isChecked={showStack} />
          </HStack>
        </Flex>
        <Grid templateColumns="repeat(auto-fill,minmax(100px,1fr))" gap="1rem">
          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i + "loadingunit"}
                h="100px"
                w="100px"
                borderRadius="1rem"
              />
            ))}
          {units
            ?.filter((unit, index) => {
              if (!showStack) return true;
              const unitName = unit?.name?.toLowerCase();
              const firstUnit = units.find(
                (item) => item.name.toLowerCase() === unitName,
              );
              const indexOfFirstUnit = units.indexOf(firstUnit!);

              if (indexOfFirstUnit === index) {
                return true;
              }
            })
            ?.map((unit) => {
              const templateUnit = UNIT_TEMPLATES.find(
                (template) => template?.name === unit.name,
              );

              if (!templateUnit) return;
              if (
                !unit?.mint ||
                !unit?.attributes?.Skill ||
                !unit?.attributes?.Rank
              )
                return;

              const count = units.filter(
                (countUnit) =>
                  countUnit.name.toLowerCase() ===
                  templateUnit.name.toLowerCase(),
              ).length;

              const selectedUnit: Unit = {
                ...templateUnit,
                mint: unit.mint,
                assetId: "todo-replace-this",
                bonus: {
                  [unit.attributes.Skill]: unit.attributes.Rank,
                },
              };
              return (
                <TroopBox
                  key={unit.mint}
                  unit={selectedUnit}
                  count={!showStack ? 1 : count ?? 0}
                />
              );
            })}
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

  const tip = (
    <VStack alignItems="start">
      <Text>Name: {unit?.name}</Text>
      <Text>Skill: {unit?.skill}</Text>
      <Text>
        {" "}
        {unit &&
          unit?.bonus &&
          Object.entries(unit?.bonus)
            .map(([enemy, bonusValue]) => `${enemy}: ${bonusValue}`)
            .join(", ")}
      </Text>
    </VStack>
  );

  if (!unit) return "";
  return (
    <Tip label={tip} placement="top">
      <Flex
        direction="column"
        justifyContent="space-between"
        h={size}
        w={size}
        mt="1rem"
        bg="brand.primary"
        p="0.5rem 1rem"
        borderRadius="0.5rem"
        backgroundImage={`url(${unit?.image})`}
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
    </Tip>
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
