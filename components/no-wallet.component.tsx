import { Text, Box } from "@chakra-ui/react";
import { LeaderboardList } from "./leaderboard";

export const PleaseSignInContainer = () => {
  return (
    <>
      <Text my="3rem" fontSize="2.5rem" fontWeight={700} textAlign="center">
        PLEASE SIGN IN WITH A SOLANA WALLET
      </Text>
      <Box maxW="900px" mt="5rem">
        <LeaderboardList />
      </Box>
    </>
  );
};
