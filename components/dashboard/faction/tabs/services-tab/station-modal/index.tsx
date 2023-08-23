import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Flex,
  VStack,
  Image,
  Grid,
  Progress,
  Button,
} from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { useCountdown } from "usehooks-ts";
import { getBlueprint } from "../constants";
import { toast } from "react-hot-toast";
import { useCharTimers } from "@/hooks/useCharTimers";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";
import { useSolana } from "@/hooks/useSolana";
import {
  useFactionStationClaim,
  useFactionStationStart,
} from "@/hooks/useFaction";
import { useAllWalletAssets } from "@/hooks/useWalletAssets";
import { BONK_MINT, RESOURCES, STATION_USE_COST_PER_LEVEL } from "@/constants";
import { useQueryClient } from "@tanstack/react-query";
import { FaClock } from "react-icons/fa";
import { ResourceContainer } from "./resource-container.component";
import { startStationProcess as startStation } from "./tx-builder";

export const ModalStation: FC<{
  station?: {
    blueprint: string;
    id: string;
    faction: string;
    level: number;
  };
  isOpen: boolean;
  onClose: () => void;
}> = ({ station, isOpen, onClose }) => {
  const {
    buildTransferIx,
    buildMemoIx,
    encodeTransaction,
    walletAddress,
    connection,
    signTransaction,
    buildBurnIx,
  } = useSolana();

  const [selectedCharacter, _] = useSelectedCharacter();
  const { data: walletAssets } = useAllWalletAssets();
  const { data: timersData } = useCharTimers({ mint: selectedCharacter?.mint });
  console.log({ timersData });

  const timer = timersData?.stationTimers.find(
    (e) => e.station === station?.id,
  );
  const finishedDate = timer?.finished && +timer?.finished;
  const finishedTime = typeof finishedDate === "number" ? finishedDate : 0;

  const remainingTime = (finishedTime - Date.now()) / 1000;
  const isFuture = remainingTime > 0;
  const isClaimable = !isFuture || timer === undefined;

  const totalTimeInSeconds = 60;
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: isFuture ? Math.floor(remainingTime) : 15,
    intervalMs: 1000,
  });

  useEffect(() => {
    if (!isClaimable) return;
    startCountdown();
  }, [isClaimable, startCountdown]);

  useEffect(() => {
    if (remainingTime < 0) return;
    resetCountdown();
    startCountdown();
  }, [remainingTime, resetCountdown, startCountdown]);

  useEffect(() => {
    if (!!timer || !isOpen) return;
    resetCountdown();
  }, [isOpen, !!timer]);

  const queryClient = useQueryClient();
  const { mutate } = useFactionStationStart();
  const { mutate: claim } = useFactionStationClaim();

  const stationBlueprint = station && getBlueprint(station?.blueprint);
  const progress = ((totalTimeInSeconds - count) / totalTimeInSeconds) * 100;
  const image = stationBlueprint?.image;
  const stationInputs = stationBlueprint?.inputs.map((e) => e.resource);
  const resourcesInWallet = walletAssets?.resources.filter((e) => {
    return stationInputs?.includes(e.name);
  });

  const startStationProcess = async () =>
    await startStation({
      connection,
      walletAddress,
      selectedCharacter,
      station,
      stationBlueprint,
      signTransaction,
      encodeTransaction,
      buildMemoIx,
      buildTransferIx,
      buildBurnIx,
      mutateStartStation: mutate,
      startCountdown,
      queryClient,
    });

  // TODO: DEV THIS IS FOR YOU TO FILL IN
  // startStationProcess
  // claimStationReward
  // const startStationProcess = async () => {
  //   if (!walletAddress) return toast.error("No wallet connected");
  //   const ix = buildMemoIx({
  //     walletAddress,
  //     payload: {
  //       mint: selectedCharacter?.mint,
  //       timestamp: Date.now().toString(),
  //       stationId: station?.id,
  //     },
  //   });

  //   const bonkIx = buildTransferIx({
  //     walletAddress,
  //     mint: BONK_MINT.toString(),
  //     amount: STATION_USE_COST_PER_LEVEL * BigInt(station?.level!),
  //     decimals: 5,
  //   });

  //   const burnIxs = stationBlueprint?.inputs?.map((e) => {
  //     return buildBurnIx({
  //       walletAddress,
  //       mint: RESOURCES.find((r) => r.name == e.resource)?.mint as string,
  //       amount: BigInt(e.amount),
  //       decimals: 0,
  //     });
  //   });

  //   if (!burnIxs || burnIxs.length === 0 || burnIxs instanceof Error)
  //     return toast.error("Ooops! No burnIx");
  //   try {
  //     const encodedTx = await encodeTransaction({
  //       walletAddress,
  //       connection,
  //       signTransaction,
  //       txInstructions: [ix, bonkIx, ...burnIxs],
  //     });

  //     if (encodedTx instanceof Error || encodedTx === undefined)
  //       return toast.error("Failed to start station");

  //     mutate(
  //       { signedTx: encodedTx },
  //       {
  //         onSuccess: () => {
  //           queryClient.refetchQueries({ queryKey: ["char-timers"] });
  //           queryClient.refetchQueries({ queryKey: ["assets"] });
  //           startCountdown();
  //           toast.success(
  //             "You've started a build in the " + station?.blueprint,
  //           );
  //         },
  //         onError: (e: any) => {
  //           toast.error("Ooops! Did not start station: \n\n" + e);
  //         },
  //       },
  //     );
  //   } catch (err) {
  //     toast.error("Oops! That didn't work: \n\n" + JSON.stringify(err));
  //   }
  // };
  const claimStationReward = async () => {
    if (!selectedCharacter?.mint || !station?.id)
      return toast.error("No Mint or StationId");
    claim(
      { mint: selectedCharacter?.mint, stationId: station.id },
      {
        onSuccess: () => {
          queryClient.refetchQueries({ queryKey: ["char-timers"] });
          queryClient.refetchQueries({ queryKey: ["assets"] });
          toast.success(
            "You've claimed the reward from the " + station?.blueprint,
          );
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="blacks.500"
        p="2rem"
        borderRadius="1rem"
        minW={{ base: "90vw", md: "70vw" }}
        minH={{ base: "90vh", md: "50vh" }}
      >
        <ModalCloseButton display={{ base: "inline", md: "none" }} />
        <ModalBody>
          <ModalHeader
            image={image ?? ""}
            name={station?.blueprint}
            desc={getBlueprint(station?.blueprint ?? "")?.description}
          />
          <Grid templateColumns="repeat(3, 1fr)" mt="4rem">
            <VStack gap="2rem">
              <Button isDisabled={!!timer} onClick={startStationProcess}>
                Start Build
              </Button>
              <ResourceContainer
                type="resources"
                isDisabled={progress === 100}
                resources={
                  stationBlueprint?.inputs.map((input) => ({
                    name: input.resource,
                    amount: input.amount,
                    balance:
                      resourcesInWallet?.find((e) => e.name === input.resource)
                        ?.value ?? "",
                  })) ?? []
                }
              />
            </VStack>
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
              mt="4rem"
            >
              <Button onClick={() => {}} mb="2rem" isDisabled={progress > 1}>
                <FaClock style={{ marginRight: "0.5rem" }} /> SPEED UP
              </Button>
              <Progress
                hasStripe={progress === 100 ? false : true}
                value={progress}
                w="100%"
                h="2rem"
                colorScheme={progress === 100 ? "green" : "blue"}
              />
              <Text>{timeAgo(count)}</Text>
            </Flex>
            <VStack gap="2rem">
              <Button onClick={claimStationReward} isDisabled={count !== 0}>
                Claim
              </Button>
              <ResourceContainer
                type="units"
                isDisabled={progress !== 100}
                resources={[
                  {
                    name: stationBlueprint?.unitOutput?.[0] ?? "",
                    amount: 1,
                    balance: "0",
                  },
                ]}
              />
            </VStack>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ModalHeader = ({
  image,
  name,
  desc,
}: {
  image: string;
  name?: string;
  desc?: string;
}) => {
  return (
    <Flex gap="1rem">
      <Image src={image} alt="station" w="15rem" borderRadius="1rem" />

      <VStack alignItems="start">
        <Text
          fontSize="3rem"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="1px"
        >
          {name}
        </Text>
        <Text letterSpacing="0.5px" noOfLines={4} textOverflow="ellipsis">
          {desc}
        </Text>
      </VStack>
    </Flex>
  );
};

function timeAgo(timestamp: number): string {
  const timeDifference = Math.floor(timestamp); // Convert to seconds
  const hours = Math.floor(timeDifference / 3600);
  const minutes = Math.floor((timeDifference % 3600) / 60);
  const seconds = timeDifference % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}
