import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Flex,
  Box,
  VStack,
  Image,
  Grid,
  Progress,
  Button,
} from "@chakra-ui/react";
import { FC, useEffect } from "react";
import styled from "@emotion/styled";
import { useCountdown } from "usehooks-ts";
import { getBlueprint } from "./constants";
import { getLocalImage } from "@/lib/utils";
import { Tip } from "@/components/tooltip";
import { toast } from "react-hot-toast";
import { useCharTimers } from "@/hooks/useCharTimers";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";
import { useSolana } from "@/hooks/useSolana";
import { useFactionStationStart } from "@/hooks/useFaction";
import { useAllWalletAssets } from "@/hooks/useWalletAssets";

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
    buildMemoIx,
    encodeTransaction,
    walletAddress,
    connection,
    signTransaction,
  } = useSolana();
  const [selectedCharacter, _] = useSelectedCharacter();
  const { data: walletAssets } = useAllWalletAssets();
  const { data: timersData } = useCharTimers({ mint: selectedCharacter?.mint });
  const totalTimeInSeconds = 60;
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: totalTimeInSeconds,
    intervalMs: 100,
  });

  useEffect(() => {
    if (isOpen) return;
    resetCountdown();
  }, [isOpen]);

  const { mutate } = useFactionStationStart();
  // TODO: DEV THIS IS FOR YOU TO FILL IN
  // startStationProcess
  // claimStationReward
  const startStationProcess = async () => {
    toast.success("You've started a build in the " + station?.blueprint);
    startCountdown();

    if (!walletAddress) return toast.error("No wallet connected");
    const ix = buildMemoIx({
      walletAddress,
      payload: {
        mint: selectedCharacter?.mint,
        timestamp: Date.now().toString(),
        stationId: station?.id,
      },
    });

    try {
      const encodedTx = await encodeTransaction({
        walletAddress,
        connection,
        signTransaction,
        txInstructions: [ix],
      });

      if (encodedTx instanceof Error || encodedTx === undefined)
        return toast.error("Failed to start station");
      mutate({ signedTx: encodedTx });
    } catch (err) {
      toast.error("Oops! That didn't work: " + err);
    }
  };
  const claimStationReward = async () => {
    toast.success("You've claimed the reward from the " + station?.blueprint);
  };

  const stationBlueprint = station && getBlueprint(station?.blueprint);
  const progress = ((totalTimeInSeconds - count) / totalTimeInSeconds) * 100;
  const image = stationBlueprint?.image;
  const stationInputs = stationBlueprint?.inputs.map((e) => e.resource);
  const resourcesInWallet = walletAssets?.resources.filter((e) => {
    return stationInputs?.includes(e.name);
  });

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
              <Button
                isDisabled={count !== totalTimeInSeconds}
                onClick={startStationProcess}
              >
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
              mt="8rem"
            >
              <Progress
                hasStripe={progress === 100 ? false : true}
                value={progress}
                w="100%"
                h="2rem"
                colorScheme={progress === 100 ? "green" : "blue"}
              />
              <Text>{count}</Text>
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

const ResourceContainer: FC<{
  isDisabled?: boolean;
  resources?: { name: string; balance: string; amount: string | number }[];
  type: "resources" | "units";
}> = ({ resources, isDisabled, type }) => {
  return (
    <Grid
      borderRadius="1rem"
      bg="brand.quaternary"
      minH="22rem"
      placeItems="center"
      p="4rem"
      opacity={isDisabled ? 0.5 : 1}
    >
      <Grid
        templateColumns={resources && resources?.length > 1 ? "1fr 1fr" : "1fr"}
        gap="1rem"
      >
        {resources?.map((resource) => (
          <Box
            key={resource.name}
            userSelect="none"
            opacity={
              type === "units" || +resource.amount < +resource.balance
                ? 1
                : 0.25
            }
          >
            <Tip
              label={"You own " + resource?.balance + " " + resource.name}
              placement="top"
            >
              <Text fontWeight={700} color="brand.secondary">
                {resource?.balance}x
              </Text>
            </Tip>
            <Tip
              label={
                (type === "resources" ? "Requires " : "Creates ") +
                resource.amount +
                " " +
                resource.name
              }
            >
              <Box
                position="relative"
                transition="all 0.25s ease-in-out"
                _hover={{ transform: "scale(1.1)" }}
              >
                <Resource
                  alt="resource"
                  src={getLocalImage({ type, name: resource.name })}
                />
                <Text
                  position="absolute"
                  bottom="0"
                  right="0"
                  bg="rgba(0,0,0,0.5)"
                  p="0.25rem 0.5rem"
                  borderRadius="1rem"
                  fontWeight={700}
                  minW="3rem"
                  textAlign="center"
                >
                  {resource.amount}
                </Text>
              </Box>
            </Tip>
          </Box>
        ))}
      </Grid>
    </Grid>
  );
};

const Resource = styled(Image)`
  border-radius: 1rem;
`;
