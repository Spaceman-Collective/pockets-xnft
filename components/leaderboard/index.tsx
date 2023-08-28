import styled from "@emotion/styled";
import { Box, Flex, Grid, Spacer, Text, VStack } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { useAllFactions } from "@/hooks/useAllFactions";
import { LeaderboardItem } from "./faction-leaderboard-bar.component";
import { Label } from "../dashboard/personal/personal.styled";
import { SortButton } from "./sort-button.component";

export const LeaderboardList = () => {
  const handleFilter = (e: any) => console.info(e);
  const { data } = useAllFactions();

  return (
    <LeaderboardContainer>
      <Flex justifyContent="space-between">
        <Title>LEADERBOARD</Title>
        <SortButton handleFilter={handleFilter} />
      </Flex>

      <Grid templateColumns="2fr 3fr">
        <Spacer />
        <Flex justifyContent="space-between" mb="1rem" opacity="0.5">
          <Label>Favors</Label>
          <Label>Dom Wins</Label>
          <Label>Wealth</Label>
          <Label>Knowledge</Label>
        </Flex>
      </Grid>
      <VStack align="start" spacing={5} overflowY="auto" h="100%" w="100%">
        {data?.factions?.map((faction) => (
          <LeaderboardItem
            key={faction.id}
            rank={faction.townhallLevel}
            name={faction.name}
            imageUrl={faction.image}
            stats={{
              knowledge: 2,
              domWins: 2,
              favor: 2,
              wealth: 2,
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
