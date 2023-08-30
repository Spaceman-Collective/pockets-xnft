import styled from "@emotion/styled";
import { Box, Flex, Grid, Spacer, Text, VStack } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { useAllFactions, useGetLeaderboard } from "@/hooks/useAllFactions";
import { LeaderboardItem } from "./faction-leaderboard-bar.component";
import { Label } from "../dashboard/personal/personal.styled";
import { SortButton } from "./sort-button.component";
import { useEffect, useState } from "react";
import { Faction } from "@/types/server";
import { Tip } from "../tooltip";

export interface FactionScore {
  faction: Faction;
  domination: number;
  wealth: number;
  knowledge: number;
}

/**
 * Leaderboard
 * @returns
 */
export const LeaderboardList = () => {
  //const handleFilter = (e: any) => console.info(e);
  const { data } = useGetLeaderboard();
  const [factions, setFactions] = useState<FactionScore[]>(
    data?.find((c) => c.condition === "knowledge")?.factions || [],
  );

  useEffect(() => {
    setFactions(data?.find((c) => c.condition == "domination")?.factions || []);
  }, [data]);

  const selectTab = (tab: string) => {
    if (tab == "domination") {
      setFactions(
        data?.find((c) => c.condition == "domination")?.factions || [],
      );
    } else if (tab == "knowledge") {
      setFactions(
        data?.find((c) => c.condition == "knowledge")?.factions || [],
      );
    } else if (tab == "wealth") {
      setFactions(data?.find((c) => c.condition == "wealth")?.factions || []);
    }
  };

  return (
    <LeaderboardContainer>
      <Flex justifyContent="space-between">
        <Title>LEADERBOARD</Title>
        {/*<SortButton handleFilter={handleFilter} />*/}
      </Flex>

      <Grid templateColumns="2fr 3fr" display={{ base: "none", sm: "grid" }}>
        <Spacer />
        <Flex justifyContent="space-between" my="1.5rem" opacity="0.5">
          <Tip label={`TODO: DEV`} placement="top">
            <Label
              onClick={() => {
                selectTab("domination");
              }}
            >
              Domination
            </Label>
          </Tip>

          <Tip label={`TODO: DEV`} placement="top">
            <Label
              onClick={() => {
                selectTab("wealth");
              }}
            >
              Wealth
            </Label>
          </Tip>

          <Tip label={`TODO: DEV`} placement="top">
            <Label
              onClick={() => {
                selectTab("knowledge");
              }}
            >
              Knowledge
            </Label>
          </Tip>
        </Flex>
      </Grid>
      <VStack align="start" spacing={5} overflowY="auto" h="100%" w="100%">
        {factions?.map((faction) => (
          <LeaderboardItem
            key={faction.faction.id}
            rank={faction.faction.townhallLevel}
            name={faction.faction.name}
            imageUrl={faction.faction.image}
            stats={{
              knowledge: faction.knowledge,
              domWins: faction.domination,
              wealth: faction.wealth,
            }}
          />
        ))}
      </VStack>
    </LeaderboardContainer>
  );
};

export const LeaderboardContainer = styled(Box)`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 3rem;
  width: 100%;
  border-radius: 0.5rem;
  background-color: ${colors.brand.primary};
`;

const Title = styled(Text)`
  text-transform: uppercase;
  font-size: 3rem;
  font-weight: 800;
  font-spacing: 3px;
  margin-bottom: 3px;
`;
