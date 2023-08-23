import { NFT, UNIT_TEMPLATES, Unit } from "@/types/server";
import { Flex, Grid, Skeleton, Text, Tooltip } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import { Value } from "./wallet-page.styles";
import styled from "@emotion/styled";

export const WalletUnitPanel: FC<{ isLoading: boolean; units: NFT[] }> = ({
  isLoading,
  units,
}) => {
  return (
    <Flex minH="60vh" direction="column" justifyContent="space-between">
      <Flex direction="column">
        <Flex mb="1rem">
          <Value style={{ textDecoration: "underline" }}>ARMY</Value>
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
          {units?.map((unit) => {
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
                count={count ?? 0}
              />
            );
          })}
          {/* {uniqueUnits.map((unit, index) => ( */}
          {/*   <TroopBox key={index} unit={unit} count={counts[unit.name]} /> */}
          {/* ))} */}
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

  //   const tooltipInfo = `
  //   Name: ${unit?.name}
  //   Skill: ${unit?.skill}
  //   Bonus: ${
  //     unit &&
  //     unit?.bonus &&
  //     Object.entries(unit?.bonus)
  //       .map(([enemy, bonusValue]) => `${enemy}: ${bonusValue}`)
  //       .join(", ")
  //   }
  // `.trim();

  if (!unit) return "";
  return (
    <Tooltip label={""} fontSize="md" placement="top" whiteSpace="pre-line">
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
