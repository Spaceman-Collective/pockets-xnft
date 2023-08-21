import { useQuery } from "@tanstack/react-query";
import { tenMockFactions } from "@/lib/mockData"


async function fetchMockFactions() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
      const leaderboardFactions = tenMockFactions;
  
    return leaderboardFactions;
  }
  
  export const useMockFactions = () => {
    return useQuery(["mock-factions"], fetchMockFactions);
  };
