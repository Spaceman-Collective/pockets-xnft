import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import Image from "next/image";
import { getLadImageURL } from "@/lib/apiClient";
import styled from "@emotion/styled";
import { H3 } from "../wizard.styled";
import Confetti from "@/components/Confetti";
import { RumbleInput } from "./rumble-input.component";
import { GenderToggleContainer } from "./gender-toggle.component";
import type { NFT } from "@/types/server";

export const Generate: FC<{
  confetti: boolean;
  fire: () => void;
  back: () => void;
  next: () => void;
  nft: NFT;
}> = ({
  confetti,
  fire: fireConfetti,
  back: backStep,
  next: nextStep,
  nft,
}) => {
  const [isMale, setIsMale] = useState(false);

  return (
    <>
      <Flex direction="column" justifyContent="space-between" minH="60vh">
        <H3>Generate your Character</H3>
        <GenImg img={nft.cached_image_uri} />
        <Box>
          <RumbleInput />
          <GenderToggleContainer isMale={isMale} setIsMale={setIsMale} />
        </Box>
        <Flex gap="2rem">
          <Button variant="outline" w="100%" alignSelf="end" onClick={backStep}>
            Back
          </Button>
          <Button
            bg="brand.quternary"
            color="brand.primary"
            _hover={{ bg: "brand.tertiary" }}
            w="100%"
            alignSelf="end"
            onClick={() => {
              fireConfetti();
              nextStep();
            }}
          >
            Mint Charachter
          </Button>
        </Flex>
      </Flex>
      {confetti && <Confetti canFire={confetti} />}
    </>
  );
};

const GenImg = ({ img }: { img: string }) => {
  return (
    <Box
      m="0 auto"
      cursor="pointer"
      position="relative"
      transition="all 0.25s ease-in-out"
    >
      <Text
        opacity="0.7"
        position="absolute"
        top="0.2rem"
        left="0.2rem"
        bg="brand.primary"
        borderRadius="1rem"
        p="0.25rem"
        fontSize="1.25rem"
        fontWeight={700}
        letterSpacing="1px"
        zIndex={10}
      >
        #{}
      </Text>
      <Img
        width="400"
        height="1"
        alt="lad"
        src={img}
        placeholder="blur"
        blurDataURL="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
      />
    </Box>
  );
};

const Img = styled(Image)`
  border-radius: 1rem;
  object-position: end;
  object-fit: cover;
  max-height: 300px;
  width: 300px;
`;
