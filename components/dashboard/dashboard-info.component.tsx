import { Box, Text, Button } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { MdLeaderboard, MdNotificationsActive } from "react-icons/md";
import { AiFillGold } from "react-icons/ai";
import { useFetchAllFactions } from "@/hooks/useFetchAllFactions";
import { useSolana } from "@/hooks/useSolana";

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
    <Box display="flex" justifyContent="space-between">
      <Box display="flex" justifyContent="flex-start">
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-end"
          marginRight="2rem"
        >
          <Text
            margin="0 auto"
            borderRadius="0.5rem"
            p="0.5rem"
            fontSize="12px"
            fontWeight={400}
            letterSpacing="1px"
            color={colors.brand.tertiary}
          >
            FACTION:
          </Text>
          <Text
            borderRadius="0.5rem"
            p="0.25rem"
            fontSize="16px"
            fontWeight={600}
            letterSpacing="1px"
          >
            {factionName}
          </Text>
        </Box>
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-end"
          marginRight="2rem"
        >
          <Text
            margin="0 auto"
            borderRadius="0.5rem"
            p="0.5rem"
            fontSize="12px"
            fontWeight={400}
            letterSpacing="1px"
            color={colors.brand.tertiary}
            flex="1"
            display="flex"
            alignItems="start"
            justifyContent="start"
          >
            LVL:
          </Text>
          <Text
            borderRadius="0.5rem"
            p="0.25rem"
            fontSize="16px"
            fontWeight={600}
            letterSpacing="1px"
            flex="1"
            display="flex"
            alignItems="flex-end"
            justifyContent="center"
          >
            {userLevel}
          </Text>
        </Box>
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-end"
          marginRight="2rem"        >
          <Text
            margin="0 auto"
            borderRadius="0.5rem"
            p="0.5rem"
            fontSize="12px"
            fontWeight={400}
            letterSpacing="1px"
            color={colors.brand.tertiary}
            flex="1"
            display="flex"
            alignItems="start"
            justifyContent="start"
          >
            BONK:
          </Text>
          <Text
            borderRadius="0.5rem"
            p="0.25rem"
            fontSize="16px"
            fontWeight={600}
            letterSpacing="1px"
            flex="1"
            display="flex"
            alignItems="flex-end"
            justifyContent="center"
          >
            {userLevel}
          </Text>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-start">
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-end"
          marginRight="2rem"
          marginLeft="2rem"
        >
          <Text
            margin="0 auto"
            borderRadius="0.5rem"
            p="0.5rem"
            fontSize="12px"
            fontWeight={400}
            letterSpacing="1px"
            color={colors.brand.tertiary}
          >
            FACTIONS:
          </Text>
          <Text
            borderRadius="0.5rem"
            p="0.25rem"
            fontSize="16px"
            fontWeight={600}
            letterSpacing="1px"
          >
            {numOfFactions}
          </Text>
        </Box>
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-end"
          marginRight="2rem"
        >
          <Text
            margin="0 auto"
            borderRadius="0.5rem"
            p="0.5rem"
            fontSize="12px"
            fontWeight={400}
            letterSpacing="1px"
            color={colors.brand.tertiary}
          >
            TOTAL RFS:
          </Text>
          <Text
            borderRadius="0.5rem"
            p="0.25rem"
            fontSize="16px"
            fontWeight={600}
            letterSpacing="1px"
          >
            {totalRfs}
          </Text>
        </Box>
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-end"
          marginRight="2rem"
        >
          <Text
            margin="0 auto"
            borderRadius="0.5rem"
            p="0.5rem"
            fontSize="12px"
            fontWeight={400}
            letterSpacing="1px"
            color={colors.brand.tertiary}
          >
            PLAYERS:
          </Text>
          <Text
            borderRadius="0.5rem"
            p="0.25rem"
            fontSize="16px"
            fontWeight={600}
            letterSpacing="1px"
          >
            {numOfPlayers}
          </Text>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-start">
        <Button
          display="flex"
          justifyContent="flex-start"
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
          justifyContent="flex-start"
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
          justifyContent="flex-start"
          alignItems="flex-end"
          p="0.5rem"
          onClick={() => {
            // Handle the click event for the third icon
          }}
        >
          <MdNotificationsActive size={24} color={colors.brand.secondary} />
        </Button>
      </Box>
    </Box>
  );
};
