import { Proposal } from "@/types/Proposal";
import type { NFT, Character, Faction, Station } from "@/types/server";
import { QueryFunctionContext } from "@tanstack/react-query";
import fetch from "axios";
const API_BASE_URL = "https://api.pockets.gg";

export const getLadImageURL = (ladNumber: number) =>
  `https://shdw-drive.genesysgo.net/J4kmNS88XbaW9mBEjyzPqwAP49jCYhYKtmqbTzGCEXUi/${ladNumber}.webp`;

export const getPogImageURL = (pogNumber: number) =>
  `https://storage.googleapis.com/fractal-launchpad-public-assets/pogs/okb/assets/collectors/assets/${pogNumber}.png`;

export const fetchCharacters = async ({
  walletAddress,
}: {
  walletAddress: string;
}): Promise<{ nfts?: NFT[]; characters?: any[] }> => {
  const URL = API_BASE_URL + "/wallet/characters";
  try {
    const response = await fetch.get<any>(URL, {
      params: {
        wallet: walletAddress,
      },
    });

    if (response.status === 200) {
      const data = await response.data;
      return data as { nfts?: NFT[]; characters?: any[] };
    } else {
      console.error("Server Error while fetching assets for wallet:", response);
      throw new Error("Server Error while fetching assets for wallet");
    }
  } catch (error) {
    console.error("Network Error while fetching assets for wallet:", error);
    throw error;
  }
};

export const fetchCharacter = async ({
  mint,
}: {
  mint: string;
}): Promise<{ character?: Character; faction?: Faction }> => {
  const URL = API_BASE_URL + "/character";
  try {
    const response = await fetch.get<any>(URL, {
      params: {
        mint: mint,
      },
    });

    if (response.status === 200) {
      const data = await response.data;
      return data as { character?: Character; faction?: Faction };
    } else {
      console.error("Server Error while fetching character:", response);
      throw new Error("Server Error while fetching character");
    }
  } catch (error) {
    console.error("Network Error while fetching character:", error);
    throw error;
  }
};

export const postCharCreate = async ({
  signedTx,
}: {
  signedTx: string;
}): Promise<Character> => {
  const URL = API_BASE_URL + "/character/create";
  try {
    const response = await fetch.post<any>(URL, { signedTx });

    if (response.status === 200) {
      const data = await response.data;
      return data;
    } else {
      console.error("Server Error while creating character:", response);
      throw new Error("Server Error while creating character");
    }
  } catch (error) {
    console.error("Network Error while creating character:", error);
    throw error;
  }
};

export const postCreateFaction = async ({
  signedTx,
}: {
  signedTx: string;
}): Promise<Faction> => {
  const URL = API_BASE_URL + "/faction/create";
  try {
    const response = await fetch.post<any>(URL, { signedTx });

    if (response.status === 200) {
      const data = await response.data;
      return data;
    } else {
      console.error("Server Error while creating faction:", response);
      throw new Error("Server Error while creating faction");
    }
  } catch (error) {
    console.error("Network Error while creating faction:", error);
    throw error;
  }
};

type FetchFactionsType = {
  factions: any[];
  total: number;
  skip: number;
  take: number;
};

export const fetchFactions = async (): Promise<FetchFactionsType> => {
  const URL = API_BASE_URL + "/factions";
  try {
    const response = await fetch.get<any>(URL, {
      params: { skip: 0, take: 10 },
    });

    if (response.status === 200) {
      const data = await response.data;
      return data;
    } else {
      console.error("Server Error while fetching factions:", response);
      throw new Error("Server Error while fetching factions");
    }
  } catch (error) {
    console.error("Network Error while fetching factions:", error);
    throw error;
  }
};

export const fetchFaction = async ({
  factionId,
}: {
  factionId: string;
}): Promise<{ faction: Faction; resources: { name: string }[] }> => {
  const URL = API_BASE_URL + "/faction";
  try {
    const response = await fetch.get<any>(URL, { params: { id: factionId } });

    if (response.status === 200) {
      const data = await response.data;
      return data;
    } else {
      console.error("Server Error while retrieving faction:", response);
      throw new Error("Server Error while retrieving faction");
    }
  } catch (error) {
    console.error("Network Error while retrieving faction:", error);
    throw error;
  }
};

export const postJoinFaction = async ({
  signedTx,
}: {
  signedTx: string;
}): Promise<any> => {
  const URL = API_BASE_URL + "/faction/join";
  try {
    const response = await fetch.post<any>(URL, { signedTx });

    if (response.status === 200) {
      const data = await response.data;
      return data;
    } else {
      console.error("Server Error while joining faction:", response);
      throw new Error("Server Error while joining faction");
    }
  } catch (error) {
    console.error("Network Error while joining faction:", error);
    throw error;
  }
};

export const postLeaveFaction = async ({
  signedTx,
}: {
  signedTx: string;
}): Promise<any> => {
  const URL = API_BASE_URL + "/faction/leave";
  try {
    const response = await fetch.post<any>(URL, { signedTx });

    if (response.status === 200) {
      const data = await response.data;
      return data;
    } else {
      console.error("Server Error while leaving faction:", response);
      throw new Error("Server Error while leaving faction");
    }
  } catch (error) {
    console.error("Network Error while leaving faction:", error);
    throw error;
  }
};

type CategorizedNFTs = {
  resources: any[];
  favors: any[];
  units: any[];
};

// fetch all compressed assets for a given wallet
export const fetchAllAssets = async ({
  walletAddress,
}: {
  walletAddress: string;
}): Promise<CategorizedNFTs> => {
  const URL = API_BASE_URL + "/wallet/assets";
  try {
    const response = await fetch.get<any>(URL, {
      params: {
        wallet: walletAddress,
      },
    });
    if (response.status === 200) {
      const data = await response.data;
      return data as CategorizedNFTs;
    } else {
      console.error(
        "Server Error while fetching compressed assets for wallet:",
        response,
      );
      throw new Error(
        "Server Error while fetching compressed assets for wallet:",
      );
    }
  } catch (error) {
    console.error(
      "Network Error while fetching compressed assets for wallet",
      error,
    );
    throw error;
  }
};

export const consumeResources = async ({
  signedTx,
}: {
  signedTx: string;
}): Promise<Character> => {
  const URL = API_BASE_URL + "/character/resources/consume";
  try {
    const response = await fetch.post<any>(URL, { signedTx });

    if (response.status === 200) {
      const data = await response.data;
      return data.character;
    } else {
      console.error(
        "Server Error while consuming resources for character:",
        response,
      );
      throw new Error("Server Error while consuming resources for character");
    }
  } catch (error) {
    console.error(
      "Network Error while consuming resources for character:",
      error,
    );
    throw error;
  }
};

type ResourceFieldPDA = String;

export const allocateResourceField = async ({
  signedTx,
}: {
  signedTx: string;
}): Promise<ResourceFieldPDA> => {
  const URL = API_BASE_URL + "/rf/allocate";
  try {
    const response = await fetch.post<any>(URL, { signedTx });

    if (response.status === 200) {
      const data = await response.data;
      return data.rfPDA as ResourceFieldPDA;
    } else {
      console.error("Server Error while allocating resources:", response);
      throw new Error("Server Error while allocating resources");
    }
  } catch (error) {
    console.error("Network Error while allocating resources:", error);
    throw error;
  }
};

export type HarvestTimer = {
  mint: string;
  rf: string;
  newTimer: string | undefined;
  resource: string | undefined;
  amount: bigint | undefined;
};

export type HarvestResouceFieldResponse = {
  harvestTimers: HarvestTimer[];
  sigs: string[];
};

export const harvestResourceField = async ({
  signedTx,
}: {
  signedTx: string;
}): Promise<HarvestResouceFieldResponse> => {
  const URL = API_BASE_URL + "/rf/harvest";
  try {
    const response = await fetch.post<any>(URL, { signedTx });

    if (response.status === 200) {
      const data = await response.data;
      return data as HarvestResouceFieldResponse;
    } else {
      console.error("Server Error while harvesting resources:", response);
      throw new Error("Server Error while harvesting resources");
    }
  } catch (error) {
    console.error("Network Error while harvesting resources:", error);
    throw error;
  }
};

// export const postCreateProposal = async ({ signedTx, mint, timestamp, proposal }: {
export const postCreateProposal = async ({
  signedTx,
}: {
  signedTx: string;
  // mint: string;
  // timestamp: string;
  // proposal: {
  //   type: string;
  //   station?: string;
  //   factionId?: string;
  //   rfId?: string;
  //   citizen?: string;
  //   resources?: { resourceId: string; amount: number }[];
  //   bonk?: string;
  //   newSharesToMint?: string;
  //   newThreshold?: string;
  //   warband?: string[];
  //   newTaxRate?: number;
  // };
}) => {
  const URL = `${API_BASE_URL}/faction/proposal/create`;
  try {
    const { data } = await fetch.post<any>(URL, {
      signedTx,
      // mint,
      // timestamp,
      // proposal
    });
    return data; // Depending on what your backend returns
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchProposal = async (proposalId: string) => {
  const URL = `${API_BASE_URL}/faction/proposal`;
  try {
    const { data } = await fetch.get<any>(URL, {
      params: {
        id: proposalId,
      },
    });
    return data;
  } catch (err) {
    console.error(err);
    return;
  }
};

interface VoteResponse {
  vote: string;
}

export type FetchResponse = {
  proposals: Proposal[];
  skip: string;
  take: string;
  total: number;
};

export const fetchProposalsByFaction = async (
  faction: string,
  skip: number,
  take: number,
): Promise<FetchResponse> => {
  const URL = `${API_BASE_URL}/faction/proposals`;
  try {
    const { data } = await fetch.get<FetchResponse>(URL, {
      params: {
        faction,
        skip,
        take,
      },
    });
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch proposals by faction");
  }
};

export const fetchFactionVotingInfo = async (
  proposalId: string,
): Promise<FetchResponse> => {
  const URL = `${API_BASE_URL}/accounts/faction`;
  try {
    const { data } = await fetch.get<FetchResponse>(URL, {
      params: {
        id: proposalId,
      },
    });
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch faction voting info");
  }
};

export const fetchCitizen = async (mint: string): Promise<FetchResponse> => {
  const URL = `${API_BASE_URL}/accounts/citizen`;
  try {
    const { data } = await fetch.get<FetchResponse>(URL, {
      params: {
        mint,
      },
    });
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch citizen");
  }
};

enum ProposalStatus {
  VOTING = "VOTING",
  PASSED = "PASSED",
  CLOSED = "CLOSED",
}

interface ProposalAccount {
  id: string;
  faction: string;
  voteAmt: string;
  status: ProposalStatus;
}

export const fetchProposalAccount = async (
  proposalId: string,
): Promise<ProposalAccount> => {
  const URL = `${API_BASE_URL}/accounts/proposal`;
  try {
    const { data } = await fetch.get<ProposalAccount>(URL, {
      params: {
        id: proposalId,
      },
    });
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch proposal account");
  }
};

interface VoteResponse {
  vote: string;
}

export const voteOnProposal = async (
  mint: string,
  proposalId: string,
): Promise<VoteResponse> => {
  const URL = `${API_BASE_URL}/accounts/vote`;
  try {
    const { data } = await fetch.get<VoteResponse>(URL, {
      params: {
        mint,
        proposalId,
      },
    });
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to vote on proposal");
  }
};

export const delegateVotes = async (
  mint: string,
  recipientMint: string,
): Promise<FetchResponse> => {
  const URL = `${API_BASE_URL}/accounts/delegation`;
  try {
    const { data } = await fetch.get<FetchResponse>(URL, {
      params: {
        mint,
        recipientMint,
      },
    });
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to delegate votes");
  }
};

export const fetchRfsFromChain = async (id: string): Promise<FetchResponse> => {
  const URL = `${API_BASE_URL}/accounts/rf`;
  try {
    const { data } = await fetch.get<FetchResponse>(URL, {
      params: {
        id,
      },
    });
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch rfs from chain");
  }
};

export const processProposal = async (
  context: QueryFunctionContext<string[], { proposalId: string }>,
) => {
  const proposalId = context.queryKey[1]; // maybe context.queryKey[0] depending on the order you pass the query key?
  const URL = `${API_BASE_URL}/faction/proposal/process`;
  try {
    const { data } = await fetch.get<any>(URL, {
      params: {
        id: proposalId,
      },
    });
    return data;
  } catch (err) {
    console.error(err);
    return;
  }
};

type CompleteConstructionResponse = {
  faction: Faction;
  station: Station;
};

export const completeConstruction = async ({
  factionId,
}: {
  factionId: string;
}): Promise<CompleteConstructionResponse> => {
  const URL = API_BASE_URL + "/faction/construction/complete";

  try {
    const response = await fetch.post<any>(URL, {
      params: {
        factionId,
      },
    });

    if (response.status === 200) {
      const data = await response.data;
      return data as CompleteConstructionResponse;
    } else {
      console.error("Server Error while constructing on faction:", response);
      throw new Error("Server Error while constructing on faction");
    }
  } catch (error) {
    console.error("Network Error while constructing on faction:", error);
    throw error;
  }
};
