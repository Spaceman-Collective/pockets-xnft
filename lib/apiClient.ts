import type { NFT, Character, Faction } from "@/types/server";
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
      signedTx
    });
    console.log('create faction: ', data);
      return data // returns Faction
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchFactions = async ({
}: {
}) => {
  const URL = API_BASE_URL + "/factions";
  try {
    const { data } = await fetch.get<any>(URL, {
      params: {
        skip: 0,
        take: 0,
      },
    });
    console.log('fetched factions: ', data);
    return data; // returns number of Factions
  } catch (err) {
    console.error(err);
    return;
  }
};

export const fetchFaction = async ({
  factionId,
}: {
  factionId: string;
}) => {
  const URL = API_BASE_URL + "/faction";
  try {
    const { data } = await fetch.get<any>(URL, {
      params: {
        id: factionId
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



