import { RESOURCES, RESOURCE_XP_GAIN } from "@/constants";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  Flex,
  Image,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { FC } from "react";
import { combatSkillKeys } from "../constants";
import { getLocalImage } from "@/lib/utils";
import { useAllWalletAssets } from "@/hooks/useWalletAssets";
import { ConsumeButton } from "./consume-button.component";
import { Tip } from "@/components/tooltip";
import { useSolana } from "@/hooks/useSolana";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";
import { useResourceConsume } from "@/hooks/useResource";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export const ConsumeSkillModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  skill: string;
}> = ({ isOpen, onClose, skill }) => {
  const relevantResources = getRelevantResources(skill);

  const {
    data: walletAssets,
    isLoading: walletAssetsIsLoading,
    isFetching,
  } = useAllWalletAssets();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        mt="20rem"
        bg="brand.primary"
        color="brand.secondary"
        p="1rem"
        minW="425px"
      >
        <ModalBody>
          <Text fontSize="4rem" textTransform="uppercase" fontWeight={700}>
            {skill}
          </Text>
          <Text fontFamily="header">
            Upgrade your {skill} by consuming resources. The more rare the
            resource, the more XP it will yield.
            <br />
            Consuming the resource burns it.
          </Text>
          <Flex direction="column" gap="1rem" p="1rem" w="100%">
            {relevantResources.map((resource) => (
              <ConsumeItemContainer
                key={resource.mint}
                skill={skill}
                isLoading={walletAssetsIsLoading || isFetching}
                resource={resource}
                resourceInWallet={walletAssets?.resources.find(
                  (asset) => asset.name === resource.name,
                )}
              />
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ConsumeItemContainer: FC<{
  isLoading?: boolean;
  resourceInWallet?: any; // items in the wallet
  skill: string; // selected modal
  resource: {
    mint: string;
    name: string;
    tier: string;
    skills: string[];
  };
}> = ({ resource, resourceInWallet, isLoading, skill }) => {
  const extraSkillUp = resource.skills.filter(
    (e) => e.toLowerCase() !== skill.toLowerCase(),
  );

  const queryClient = useQueryClient();

  const {
    buildMemoIx,
    buildBurnIx,
    walletAddress,
    connection,
    encodeTransaction,
    signTransaction,
  } = useSolana();
  const [selectedCharacter] = useSelectedCharacter();

  //TODO: DEV PUT CONSUME CODE IN HERE
  //will be called with the number from input box

  const { mutate } = useResourceConsume();
  const postConsume = async (amountToConsume: number) => {
    console.log({ amountToConsume, resource: resource.name });
    const memoIx = buildMemoIx({
      walletAddress: walletAddress as string,
      payload: {
        mint: selectedCharacter?.mint,
        timestamp: Date.now().toString(),
        resource: resource.name,
        amount: amountToConsume,
      },
    });

    const burnIx = buildBurnIx({
      walletAddress: walletAddress as string,
      mint: RESOURCES.find((r) => r.name == resource.name)?.mint as string,
      amount: BigInt(amountToConsume),
      decimals: 0,
    });

    console.log(
      "burnIx",
      burnIx.keys.map((e) => e.pubkey.toString()),
    );

    try {
      const encodedTx = await encodeTransaction({
        walletAddress: walletAddress as string,
        connection,
        signTransaction,
        txInstructions: [memoIx, burnIx],
      });

      if (!encodedTx || (encodedTx as any)  instanceof Error)
        return toast.error("Oops! Failed to consume resource");
      mutate(
        { signedTx: encodedTx },
        {
          onSuccess: (e) => {
            queryClient.refetchQueries({
              queryKey: ["wallet-assets"],
            });
            queryClient.refetchQueries({
              queryKey: ["assets"],
            });
            toast.success("Successfully consumed");
          },
          onError: (e) =>
            toast.error("Oops! Failed to consume: " + JSON.stringify(e)),
        },
      );
    } catch (err) {
      toast.error("Oops! Failed to consume resource: " + err);
    }
  };

  return (
    <Flex
      key={resource.mint}
      gap="1rem"
      justifyContent="space-between"
      alignItems="center"
    >
      <Image
        w="10rem"
        borderRadius="1rem"
        alt={resource.name}
        src={getLocalImage({
          type: "resources",
          name: resource.name,
        })}
      />
      <VStack alignItems="start" justifyContent="start" flexGrow={1}>
        <Text
          textTransform="uppercase"
          fontWeight={700}
          fontSize="2rem"
          letterSpacing="1px"
        >
          {resource.name}
        </Text>
        <Text fontSize="1.25rem" letterSpacing="0.5px">
          {
            //@ts-ignore
            RESOURCE_XP_GAIN?.[resource.tier]
          }
          xp ({resource.tier})
        </Text>
        {extraSkillUp.length > 0 && (
          <Tip
            label={
              "Comsuming will simulatneously gain xp in " +
              extraSkillUp.join(" ")
            }
          >
            <Text
              textTransform="uppercase"
              letterSpacing="1px"
              fontSize="1.25rem"
              bg="blacks.700"
              p="0.5rem 1rem"
              borderRadius="1rem"
            >
              +{extraSkillUp}
            </Text>
          </Tip>
        )}
      </VStack>
      <VStack
        flexGrow={1}
        alignItems="end"
        opacity={resourceInWallet?.value !== "0" ? 1 : 0.25}
      >
        <Flex
          fontSize="1.25rem"
          bg="blacks.700"
          borderRadius="1rem"
          gap="0.5rem"
          alignItems="center"
        >
          <Text
            fontSize="1.5rem"
            fontWeight={700}
            letterSpacing="1px"
            borderRadius="1rem 0 0 1rem"
            bg="blacks.600"
            py="0.5rem"
            px="0.75rem"
          >
            {isLoading && <Spinner mb="-2px" />}
            {!isLoading && resourceInWallet?.value + "x"}
          </Text>
          <Text textTransform="uppercase" letterSpacing="1px" pr="0.5rem">
            Balance
          </Text>
        </Flex>
        <ConsumeButton
          onClick={postConsume}
          isDisabled={resourceInWallet?.value === "0"}
          maxValue={+resourceInWallet?.value}
        />
      </VStack>
    </Flex>
  );
};

const getRelevantResources = (skill: string) =>
  RESOURCES.filter((resource) => {
    const isCombat = combatSkillKeys.includes(skill.toLowerCase());
    const resourceSkills = resource.skills.map((sk) => sk.toLowerCase());
    return resourceSkills.includes(skill);
  });
