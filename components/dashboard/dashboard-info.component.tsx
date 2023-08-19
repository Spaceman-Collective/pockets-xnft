import { Box, Text, Button, Flex } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { MdLeaderboard, MdNotificationsActive } from "react-icons/md";
import { AiFillGold } from "react-icons/ai";
import { useFetchAllFactions } from "@/hooks/useFetchAllFactions";
import { useSolana } from "@/hooks/useSolana";
import styled from "@emotion/styled";

export const DashboardInfo = () => {
  const factionName = "MAD OGSSS";
  const userLevel = 0;

  const { getBonkBalance } = useSolana();
  const { data: currentFs } = useFetchAllFactions();

  const numOfFactions = currentFs?.total;
  const totalRfs = 0;
  const numOfPlayers = 0;
  const bonkbalance = getBonkBalance;

  return (
    <Flex justifyContent="space-between">
      <Flex gap="2rem">
        <Flex alignItems="flex-end">
          <Label>FACTION:</Label>
          <Value>{factionName}</Value>
        </Flex>
        <Flex alignItems="flex-end">
          <Label>LVL:</Label>
          <Value>{userLevel}</Value>
        </Flex>
        <Flex alignItems="flex-end">
          <Label>BONK:</Label>
          <Value>{userLevel}</Value>
        </Flex>
      </Flex>
      <Flex gap="2rem">
        <Flex alignItems="flex-end">
          <Label>FACTIONS:</Label>
          <Value>{numOfFactions}</Value>
        </Flex>
        <Flex alignItems="flex-end">
          <Label>TOTAL RFS:</Label>
          <Value>{totalRfs}</Value>
        </Flex>
        <Flex alignItems="flex-end">
          <Label>PLAYERS:</Label>
          <Value>{numOfPlayers}</Value>
        </Flex>
      </Flex>
      <Flex gap="2rem">
        <Button
          display="flex"
          alignItems="flex-end"
          marginRight="2rem"
          p="0.5rem"
          onClick={() => {
            // Handle the click event for the first icon
          }}
        >
          <AiFillGold size={24} color={colors.brand.secondary} />
        </Button>
        <Button
          display="flex"
          alignItems="flex-end"
          marginRight="2rem"
          p="0.5rem"
          onClick={() => {
            // Handle the click event for the second icon
          }}
        >
          <MdLeaderboard size={24} color={colors.brand.secondary} />
        </Button>
        <Button
          display="flex"
          alignItems="flex-end"
          p="0.5rem"
          onClick={() => {
            // Handle the click event for the third icon
          }}
        >
          <MdNotificationsActive size={24} color={colors.brand.secondary} />
        </Button>
      </Flex>
    </Flex>
  );
};

const Label = styled(Text)`
  margin: 0 auto;
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 1px;
  color: ${colors.brand.tertiary};
`;
const Value = styled(Text)`
  border-radius: 0.5rem;
  padding: 0.25rem;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 1px;
`;
