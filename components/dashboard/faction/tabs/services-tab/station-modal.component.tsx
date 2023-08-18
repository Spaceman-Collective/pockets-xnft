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
} from "@chakra-ui/react";
import { FC } from "react";
import styled from "@emotion/styled";

export const ModalStation: FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  console.log({ isOpen });
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
          <ModalHeader />
          <Grid templateColumns="repeat(3, 1fr)" mt="4rem">
            <ResourceContainer
              resources={[
                { img: "https://picsum.photos/seed/1/200/200" },
                { img: "https://picsum.photos/seed/2/200/200" },
                { img: "https://picsum.photos/seed/3/200/200" },
              ]}
            />
            <Grid minH="20rem" placeItems="center">
              init materials
            </Grid>
            <ResourceContainer
              resources={[{ img: "https://picsum.photos/seed/1/200" }]}
            />
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ModalHeader = () => {
  return (
    <Flex gap="1rem">
      <Image
        src="https://picsum.photos/200"
        alt="station"
        w="15rem"
        borderRadius="1rem"
      />

      <VStack alignItems="start">
        <Text
          fontSize="3rem"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="1px"
        >
          Station Name
        </Text>
        <Text letterSpacing="0.5px" noOfLines={4} textOverflow="ellipsis">
          {lorem + lorem + lorem}
        </Text>
      </VStack>
    </Flex>
  );
};

const ResourceContainer: FC<{ resources: { img: string }[] }> = ({
  resources,
}) => {
  return (
    <Grid
      borderRadius="1rem"
      bg="brand.quaternary"
      minH="20rem"
      placeItems="center"
      p="4rem"
    >
      <Grid
        templateColumns={resources?.length > 1 ? "1fr 1fr" : "1fr"}
        gap="1rem"
      >
        {resources?.map((resource) => (
          <Box
            key={resource.img}
            position="relative"
            transition="all 0.25s ease-in-out"
            _hover={{ transform: "scale(1.1)" }}
          >
            <Resource alt="resource" src={resource.img} />
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
