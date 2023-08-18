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
}) => {
  const URL = API_BASE_URL + "/wallet/characters";
  try {
    const { data } = await fetch.get<any>(URL, {
      params: {
        wallet: walletAddress,
      },
    });
    return data as { nfts?: NFT[]; characters?: any[] };
  } catch (err) {
    console.error(err);
    return;
  }
};

export const fetchCharacter = async ({ mint }: { mint: string }) => {
  const URL = API_BASE_URL + "/character";
  try {
    const { data } = await fetch.get<any>(URL, {
      params: {
        mint: mint,
      },
    });
    console.log('character: ', data);
    return data as { character?: Character; faction?: Faction }; // returns { character, faction }
  } catch (err) {
    console.error(err);
    return;
  }
};

export const postCharCreate = async ({ signedTx }: { signedTx: string }) => {
  const URL = API_BASE_URL + "/character/create";
  try {
    const { data } = await fetch.post<any>(URL, {
      signedTx,
    });
    return data; // returns CharacterModel
  } catch (err) {
    console.error(err);
    return;
  }
};

export const postCreateFaction = async ({ signedTx }: { signedTx: string }) => {
  const URL = API_BASE_URL + "/faction/create";
  try {
    const { data } = await fetch.post<any>(URL, {
      signedTx,
    });
    console.log('create faction: ', data);
      return data // returns Faction
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchFactions = async ({}: {}) => {
  const URL = API_BASE_URL + "/factions";
  try {
    const { data } = await fetch.get<any>(URL, {
      params: {
        skip: 0,
        take: 10,
      },
    });
    console.log('fetched factions: ', data);
    return data; // returns number of Factions
  } catch (err) {
    console.error(err);
    return;
  }
};

export const fetchFaction = async ({ factionId }: { factionId: string }) => {
  const URL = API_BASE_URL + "/faction";
  try {
    const { data } = await fetch.get<any>(URL, {
      params: {
        id: factionId,
      },
    });
    console.log('retrieved faction: ', data);
    return data; // returns Faction
  } catch (err) {
    console.error(err);
    return;
  }
};

export const postJoinFaction = async ({ signedTx }: { signedTx: string }) => {
  const URL = API_BASE_URL + "/faction/join";
  try {
    const { data } = await fetch.post<any>(URL, {
      signedTx,
    });
    console.log('join faction: ', data);
    return data;
  } catch (err) {
    console.error(err);
    return;
  }
};

export const postLeaveFaction = async ({ signedTx }: { signedTx: string }) => {
  const URL = API_BASE_URL + "/faction/leave";
  try {
    const { data } = await fetch.post<any>(URL, {
      signedTx,
    });
    console.log('leave faction: ', data);
    return data;
  } catch (err) {
    console.error(err);
    return;
  }
};

type CategorizedNFTs = {
  resources: any[];
  favors: any[];
  units: any[];
};

// fetch all compressed assets for a given wallet
export const fetchCompressedNftAssets = async ({
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
      console.log(
        "Server Error while fetching compressed assets for wallet:",
        response,
      );
      throw new Error("Server Error while fetching compressed assets for wallet:");
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
      console.log(
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
      console.log("Server Error while allocating resources:", response);
      throw new Error("Server Error while allocating resources");
    }
  } catch (error) {
    console.error("Network Error while allocating resources:", error);
    throw error;
  }
};

type HarvestTimer = {
  mint: string;
  rf: string;
  newTimer: string | undefined;
  resource: string | undefined;
  amount: bigint | undefined;
};

type HarvestResouceFieldResponse = {
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
      console.log("Server Error while harvesting resources:", response);
      throw new Error("Server Error while harvesting resources");
    }
  } catch (error) {
    console.error("Network Error while harvesting resources:", error);
    throw error;
  }
};

// export const postCreateProposal = async ({ signedTx, mint, timestamp, proposal }: {
  export const postCreateProposal = async ({ signedTx }: {

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
    console.log('create proposal: ', data);
    return data; // Depending on what your backend returns
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchProposal = async (context: QueryFunctionContext<string[], { proposalId: string }>) => {
  const proposalId = context.queryKey[1]; // maybe context.queryKey[0] depending on the order you pass the query key?
  const URL = `${API_BASE_URL}/faction/proposal`;
  try {
    const { data } = await fetch.get<any>(URL, {
      params: {
        id: proposalId,
      },
    });
    console.log('retrieved proposal: ', data);
    return data;
  } catch (err) {
    console.error(err);
    return;
  }
};

export const processProposal = async (context: QueryFunctionContext<string[], { proposalId: string }>) => {
  const proposalId = context.queryKey[1]; // maybe context.queryKey[0] depending on the order you pass the query key?
  const URL = `${API_BASE_URL}/faction/proposal/process`;
  try {
    const { data } = await fetch.get<any>(URL, {
      params: {
        id: proposalId,
      },
    });
    console.log('retrieved proposal: ', data);
    return data;
  } catch (err) {
    console.error(err);
    return;
  }
};

export const fetchProposalsByFaction = async (context: QueryFunctionContext<string[]>) => {
  const faction = context.queryKey[0];
  const skip = context.queryKey[1] ? Number(context.queryKey[1]) : 0;
  const take = context.queryKey[2] ? Number(context.queryKey[2]) : 10;

  const URL = `${API_BASE_URL}/proposals`;
  try {
    const { data } = await fetch.get<any>(URL, {
      params: {
        faction,
        skip,
        take,
      },
    });
    console.log('retrieved proposals by faction: ', data);
    return data; // returns an object with proposals, skip, take, and total count
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
      console.log("Server Error while constructing on faction:", response);
      throw new Error("Server Error while constructing on faction");
    }
  } catch (error) {
    console.error("Network Error while constructing on faction:", error);
    throw error;
  }
};
