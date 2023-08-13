import { getLadImageURL } from "@/lib/apiClient";
import { colors } from "@/styles/defaultTheme";
import { Button, Grid, Flex, Text, Box } from "@chakra-ui/react";
import Image from "next/image";
import styled from "@emotion/styled";
import { FC } from "react";
import { H3 } from ".";

export const SelectNFT: FC<{ back: () => void; next: () => void }> = ({
  next: nextStep,
  back: backStep,
}) => {
  return (
    <Flex direction="column" justifyContent="space-between" minH="60vh">
      <Box>
        <Text>
          Select from one of your <strong>Mad Lads</strong> to create a
          Character with. You will be asked to sign a message on the next screen
          to confirm.
        </Text>
        <H3 pt="4rem">NFTs</H3>
        <Grid
          templateColumns="repeat(auto-fill, minmax(100px, 1fr))"
          gap="1rem"
          mb="3rem"
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <Lad key={"la" + i} lad={10 + i * 4 + 6} />
          ))}
        </Grid>
      </Box>
      <Flex gap="2rem">
        <Button variant="outline" w="100%" alignSelf="end" onClick={backStep}>
          Back
        </Button>
        <Button w="100%" alignSelf="end" onClick={nextStep}>
          Continue
        </Button>
      </Flex>
    </Flex>
  );
};

const Thumbnail = styled(Grid)<{ isSelected?: boolean }>`
  cursor: pointer;
  background-color: ${colors.brand.primary};
  height: 150px;
  width: 150px;
  border: solid 0px transparent;
  border-radius: 0.5rem;
  place-items: center;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
  :hover {
    border: solid 2px ${colors.brand.secondary};
  }
  transition: all 0.25s ease-in-out;
`;

const Lad = ({ lad }: { lad: number }) => {
  return (
    <Box
      cursor="pointer"
      position="relative"
      transition="all 0.25s ease-in-out"
      _hover={{
        transform: "scale(1.2)",
      }}
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
        #{lad}
      </Text>
      <Img width="100" height="100" alt="lad" src={getLadImageURL(lad)} />
    </Box>
  );
};

const Img = styled(Image)`
  border-radius: 1rem;
  object-position: end;
  object-fit: cover;
  width: 100px;
  height: 100px;
`;
