import type { NFT } from "@/types/server";
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
    return data; // returns number of Factions
  } catch (err) {
    console.error(err);
    return;
  }
};

