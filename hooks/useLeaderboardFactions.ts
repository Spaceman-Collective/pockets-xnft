import { useQuery } from "@tanstack/react-query";
import { generateMockFactions } from "@/lib/mockData"


async function fetchLeaderbaordFactions() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
      const leaderboardFactions = generateMockFactions(40);
  
    return leaderboardFactions;
  }
  
  export const useLeaderboardFactions = () => {
    return useQuery("leaderboard-factions", fetchLeaderbaordFactions);
  };