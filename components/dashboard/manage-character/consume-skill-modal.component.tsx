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
  Tag,
  Button,
} from "@chakra-ui/react";
import { FC } from "react";
import { combatSkillKeys } from "./constants";
import { getLocalImage } from "@/lib/utils";
import { useAllWalletAssets } from "@/hooks/useWalletAssets";

export const ConsumeSkillModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  skill: string;
}> = ({ isOpen, onClose, skill }) => {
  const relevantResources = getRelevantResources(skill);

  const { data: walletAssets, isLoading: walletAssetsIsLoading } =
    useAllWalletAssets();

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
                </VStack>
                <VStack
                  alignItems="end"
                  opacity={
                    walletAssets?.resources.find(
                      (asset) => asset.name === resource.name,
                    ).value !== "0"
                      ? 1
                      : 0.25
                  }
                >
                  <Flex
                    fontSize="1.25rem"
                    bg="blacks.700"
                    borderRadius="1rem"
                    gap="0.5rem"
                    alignItems="center"
                  >
                    <Text
                      textTransform="uppercase"
                      letterSpacing="1px"
                      pl="1rem"
                    >
                      Balance:
                    </Text>
                    <Text
                      fontSize="1.5rem"
                      fontWeight={700}
                      letterSpacing="1px"
                      borderRadius="0 1rem 1rem 0"
                      bg="blacks.600"
                      py="0.5rem"
                      px="0.75rem"
                    >
                      {
                        walletAssets?.resources.find(
                          (asset) => asset.name === resource.name,
                        ).value
                      }
                      x
                    </Text>
                  </Flex>
                  <Button
                    bg={
                      walletAssets?.resources.find(
                        (asset) => asset.name === resource.name,
                      ).value !== "0"
                        ? "blacks.700"
                        : "brand.primary"
                    }
                    h="fit-content"
                    opacity="0.5"
                    transition="all 0.25s ease-in-out"
                    _hover={{ opacity: 1 }}
                  >
                    Consume
                  </Button>
                </VStack>
              </Flex>
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const getRelevantResources = (skill: string) =>
  RESOURCES.filter((resource) => {
    const isCombat = combatSkillKeys.includes(skill.toLowerCase());
    const resourceSkills = resource.skills.map((sk) => sk.toLowerCase());
    return resourceSkills.includes(skill);
  });
