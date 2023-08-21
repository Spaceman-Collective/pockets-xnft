import { useQuery } from "@tanstack/react-query";
import { tenMockFactionStats } from "@/lib/mockData"


async function fetchMockFactionStats() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
      const leaderboardFactions = tenMockFactionStats;
  
    return leaderboardFactions;
  }
  
  export const useMockFactionStats = () => {
    return useQuery(["mock-factions"], fetchMockFactionStats);
  };
