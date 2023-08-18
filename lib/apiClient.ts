import type { NFT, Character, Faction, Station } from "@/types/server";
import fetch from "axios";
const API_BASE_URL = "https://api.pockets.gg";

export const getLadImageURL = (ladNumber: number) =>
  `https://shdw-drive.genesysgo.net/J4kmNS88XbaW9mBEjyzPqwAP49jCYhYKtmqbTzGCEXUi/${ladNumber}.webp`;

export const getPogImageURL = (pogNumber: number) =>
  `https://storage.googleapis.com/fractal-launchpad-public-assets/pogs/okb/assets/collectors/assets/${pogNumber}.png`;

export const fetchAssets = async ({
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
      console.log(
        "Server Error while fetching assets for wallet:",
        response,
      );
      throw new Error("Server Error while fetching assets for wallet");
    }
    
  } catch (error) {
    console.error(
      "Network Error while fetching assets for wallet:",
      error,
    );
    throw error;
  }
};

export const fetchCharacter = async ({ mint }: { mint: string }): Promise<{ character?: Character; faction?: Faction }> => {
  const URL = API_BASE_URL + "/character";
  try {
    const response = await fetch.get<any>(URL, {
      params: {
        mint: mint,
      },
    });
    
    if (response.status === 200) {
      const data = await response.data;
      console.log('character: ', data);
      return data as { character?: Character; faction?: Faction };
    } else {
      console.log(
        "Server Error while fetching character:",
        response,
      );
      throw new Error("Server Error while fetching character");
    }
    
  } catch (error) {
    console.error(
      "Network Error while fetching character:",
      error,
    );
    throw error;
  }
};

export const postCharCreate = async ({ signedTx }: { signedTx: string }): Promise<CharacterModel> => {
  const URL = API_BASE_URL + "/character/create";
  try {
    const response = await fetch.post<any>(URL, { signedTx });
    
    if (response.status === 200) {
      const data = await response.data;
      return data;
    } else {
      console.log(
        "Server Error while creating character:",
        response,
      );
      throw new Error("Server Error while creating character");
    }

  } catch (error) {
    console.error(
      "Network Error while creating character:",
      error,
    );
    throw error;
  }
};

export const postCreateFaction = async ({ signedTx }: { signedTx: string }): Promise<Faction> => {
  const URL = API_BASE_URL + "/faction/create";
  try {
    const response = await fetch.post<any>(URL, { signedTx });

    if (response.status === 200) {
      const data = await response.data;
      console.log('create faction: ', data);
      return data;
    } else {
      console.log(
        "Server Error while creating faction:",
        response,
      );
      throw new Error("Server Error while creating faction");
    }

  } catch (error) {
    console.error(
      "Network Error while creating faction:",
      error,
    );
    throw error;
  }
};

export const fetchFactions = async (): Promise<number> => {
  const URL = API_BASE_URL + "/factions";
  try {
    const response = await fetch.get<any>(URL, { params: { skip: 0, take: 10 } });

    if (response.status === 200) {
      const data = await response.data;
      console.log('fetched factions: ', data);
      return data;
    } else {
      console.log(
        "Server Error while fetching factions:",
        response,
      );
      throw new Error("Server Error while fetching factions");
    }

  } catch (error) {
    console.error(
      "Network Error while fetching factions:",
      error,
    );
    throw error;
  }
};

export const fetchFaction = async ({ factionId }: { factionId: string }): Promise<Faction> => {
  const URL = API_BASE_URL + "/faction";
  try {
    const response = await fetch.get<any>(URL, { params: { id: factionId } });

    if (response.status === 200) {
      const data = await response.data;
      console.log('retrieved faction: ', data);
      return data;
    } else {
      console.log(
        "Server Error while retrieving faction:",
        response,
      );
      throw new Error("Server Error while retrieving faction");
    }

  } catch (error) {
    console.error(
      "Network Error while retrieving faction:",
      error,
    );
    throw error;
  }
};

export const postJoinFaction = async ({ signedTx }: { signedTx: string }): Promise<any> => {
  const URL = API_BASE_URL + "/faction/join";
  try {
    const response = await fetch.post<any>(URL, { signedTx });

    if (response.status === 200) {
      const data = await response.data;
      console.log('join faction: ', data);
      return data;
    } else {
      console.log(
        "Server Error while joining faction:",
        response,
      );
      throw new Error("Server Error while joining faction");
    }

  } catch (error) {
    console.error(
      "Network Error while joining faction:",
      error,
    );
    throw error;
  }
};

export const postLeaveFaction = async ({ signedTx }: { signedTx: string }): Promise<any> => {
  const URL = API_BASE_URL + "/faction/leave";
  try {
    const response = await fetch.post<any>(URL, { signedTx });

    if (response.status === 200) {
      const data = await response.data;
      console.log('leave faction: ', data);
      return data;
    } else {
      console.log(
        "Server Error while leaving faction:",
        response,
      );
      throw new Error("Server Error while leaving faction");
    }

  } catch (error) {
    console.error(
      "Network Error while leaving faction:",
      error,
    );
    throw error;
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
