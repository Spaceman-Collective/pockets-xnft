import type { NFT } from "@/types/server";
import fetch from "axios";
const API_BASE_URL = "https://api.pockets.gg";

export const getLadImageURL = (ladNumber: number) =>
  `https://shdw-drive.genesysgo.net/J4kmNS88XbaW9mBEjyzPqwAP49jCYhYKtmqbTzGCEXUi/${ladNumber}.webp`;

export const fetchAssets = async ({
  walletAddress,
}: {
  walletAddress: string;
}) => {
  const URL = API_BASE_URL + "/assets";
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
