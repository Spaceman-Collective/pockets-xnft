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
  const [selectedCharacter, _] = useSelectedCharacter();
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

  console.log({ timersData });
  // TODO: DEV this is where you enter the functions for the build and claim process
  // I'll help add the timers. The data is visiable in the above console.log

  const startStationProcess = async () => {
    toast.success("You've started a build in the " + station?.blueprint);
    startCountdown();
  };
  const claimStationReward = async () => {
    console.log("CLAIM");
    toast.success("You've claimed the reward from the " + station?.blueprint);
  };

  const stationBlueprint = station && getBlueprint(station?.blueprint);
  const progress = ((totalTimeInSeconds - count) / totalTimeInSeconds) * 100;
  const image = stationBlueprint?.image;

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
                  stationBlueprint?.inputs.map((input) => input.resource) ?? []
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
                resources={stationBlueprint?.unitOutput ?? []}
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
  resources: string[];
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
        templateColumns={resources?.length > 1 ? "1fr 1fr" : "1fr"}
        gap="1rem"
      >
        {resources?.map((resource) => (
          <Tip key={resource} label={resource}>
            <Box
              position="relative"
              transition="all 0.25s ease-in-out"
              _hover={{ transform: "scale(1.1)" }}
            >
              <Resource
                alt="resource"
                src={getLocalImage({ type, name: resource })}
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
                5
              </Text>
            </Box>
          </Tip>
        ))}
      </Grid>
    </Grid>
  );
};

const Resource = styled(Image)`
  border-radius: 1rem;
`;

const lorem = `Really, you're gonna pull that move? I guided your entire civilisation. Your people have a holiday named ricksgiving. They teach kids about me in school. Morty! The principal and I have discussed it, a-a-and we're both insecure enough to agree to a three-way! You know what shy pooping is, Rick? Merchandise Morty, your only purpose in life is to buy & consume merchandise and you did it, you went into a store an actual honest to god store and you bought something, you didn't ask questions or raise ethical complaints you just looked into the bleeding jaws of capitalism and said 'yes daddy please' and I'm so proud of you, I only wish you could have bought more, I love buying things so much Morty.

Nice one, Ms Pancakes. Haha god-damn! If it were, you could call ME Ernest Hemingway. I'm Scary Terry!! You can run but you can't hide, bitch!

And that's why I always say 'Shumshumschilpiddydah!' Are you invisible and you're gonna, like, fart on me? Awww, it's you guys! I don't think we can perform our new song, The Recipe For Concentrated Dark Matter for a crowd this tiny!

I know you're real because i have a ton of bad memories with you. If you break the rules, try to leave or lose the game, you will die. Just like Saaaaw. 25 shmeckles? I-I-I-I don't even know what that- what is that? Is that a lot? It's like the N word and the C word had a baby, and it was raised by all the bad words for Jews.`;
