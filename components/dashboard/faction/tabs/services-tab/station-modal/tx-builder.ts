import {
  BONK_MINT,
  RESOURCES,
  SERVER_KEY,
  STATION_USE_COST_PER_LEVEL,
} from "@/constants";
import { Connection, TransactionInstruction } from "@solana/web3.js";
import { toast } from "react-hot-toast";
import { Blueprint } from "../constants";
import { QueryClient, UseMutateFunction } from "@tanstack/react-query";
import { buildTransferIx } from "@/hooks/useSolana";
import { Faction } from "@/types/server";

type Props = {
  startCountdown: () => void;
  buildMemoIx: (prop: any) => TransactionInstruction;
  buildBurnIx: (prop: any) => TransactionInstruction;
  mutateStartStation: (prop: any, handle: any) => any;
  encodeTransaction: (prop: any) => Promise<any | undefined>;
  stationBlueprint?: Blueprint;
  signTransaction: any;
  connection: Connection;
  walletAddress?: string;
  selectedCharacter: any;
  station: any;
  queryClient: QueryClient;
};

export const startStationProcess = async ({
  connection,
  walletAddress,
  selectedCharacter,
  station,
  stationBlueprint,
  signTransaction,
  encodeTransaction,
  buildMemoIx,
  buildBurnIx,
  mutateStartStation,
  startCountdown,
  queryClient,
}: Props) => {
  if (!walletAddress) return toast.error("No wallet connected");
  const ix = buildMemoIx({
    walletAddress,
    payload: {
      mint: selectedCharacter?.mint,
      timestamp: Date.now().toString(),
      stationId: station?.id,
    },
  });

  const bonkIx = await buildTransferIx({
    walletAddress,
    connection,
    receipientAddress: SERVER_KEY,
    mint: BONK_MINT.toString(),
    amount: STATION_USE_COST_PER_LEVEL * BigInt(station?.level!),
    decimals: 5,
  });

  const burnIxs = stationBlueprint?.inputs?.map((e) => {
    return buildBurnIx({
      walletAddress,
      mint: RESOURCES.find((r) => r.name == e.resource)?.mint as string,
      amount: BigInt(e.amount),
      decimals: 0,
    });
  });

  if (!burnIxs || burnIxs.length === 0 || burnIxs instanceof Error)
    return toast.error("Ooops! No burnIx");
  try {
    const encodedTx = await encodeTransaction({
      walletAddress,
      connection,
      signTransaction,
      txInstructions: [ix, bonkIx, ...burnIxs],
    });

    if (encodedTx instanceof Error || encodedTx === undefined)
      return toast.error("Failed to start station");

    mutateStartStation(
      { signedTx: encodedTx },
      {
        onSuccess: () => {
          queryClient.refetchQueries({ queryKey: ["char-timers"] });
          queryClient.refetchQueries({ queryKey: ["assets"] });
          queryClient.refetchQueries({ queryKey: ["wallet-assets"] });
          startCountdown();
          toast.success("You've started a build in the " + station?.blueprint);
        },
        onError: (e: any) => {
          toast.error("Ooops! Did not start station: \n\n" + e);
        },
      }
    );
  } catch (err) {
    toast.error("Oops! That didn't work: \n\n" + JSON.stringify(err));
  }
};
