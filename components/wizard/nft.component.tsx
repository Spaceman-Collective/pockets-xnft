import { Button, Grid, Flex, Text, Box, Skeleton } from "@chakra-ui/react";
import { FC } from "react";
import { H3 } from ".";
import { Frame, Lad } from "./wizard.components";
import type { Character, NFT } from "@/types/server";
import styled from "@emotion/styled";
import { colors, fonts } from "@/styles/defaultTheme";
import { Tip } from "../tooltip";
import Head from "next/head";

export const SelectNFT: FC<{
  next: () => void;
  data?: { nfts?: NFT[]; characters?: any[] };
  isLoading?: boolean;
  select: (mint: string) => void;
  setReview: (char: Character) => void;
}> = ({ next: nextStep, data, isLoading, select, setReview }) => {
  const arrayOfMintedChars = data?.characters?.map((record) => record.mint);

  return (
    <Flex direction="column" justifyContent="space-between" minH="60vh">
      <Header>Create a Character</Header>
      <Grid templateColumns="repeat(auto-fill, minmax(100px, 1fr))" gap="1rem">
        <Thumbnail
          backgroundImage="collection/madlads.webp"
          backgroundPosition="bottom"
          backgroundSize="cover"
          cursor="pointer"
          onClick={nextStep}
        >
          <Text>Mad Lads</Text>
        </Thumbnail>
        <Thumbnail
          cursor="pointer"
          backgroundImage={"collection/famousfoxes.webp"}
          backgroundSize="cover"
          backgroundPosition="center"
          onClick={nextStep}
        >
          <Text>Famous Foxes</Text>
        </Thumbnail>
        <Tip label="Coming soon!">
          <Thumbnail userSelect="none" cursor="not-allowed" opacity="0.5">
            Kyogen
          </Thumbnail>
        </Tip>
      </Grid>
      <Box>
        <Text>
          Select from one of your <strong>NFTs</strong> from the above
          collections to create a Character with. You will be asked to sign a
          message on the next screen to confirm.
        </Text>

        <H3 pt="4rem">Characters</H3>
        <Grid
          templateColumns="repeat(auto-fill, minmax(100px, 1fr))"
          gap="1rem"
          mb="3rem"
        >
          {data?.characters
            ?.filter((record) => !!record)
            .map((record) => (
              <Frame
                key={record?.mint + "owned"}
                img={record?.image}
                select={() => {
                  setReview(record);
                }}
              />
            ))}
          {isLoading && <Skeletons />}
        </Grid>
        <Tip label="NFTs available to create a character with" placement="top">
          <H3 pt="4rem" w="fit-content" h="fit-content">
            Availbe NFTs
          </H3>
        </Tip>
        <Grid
          templateColumns="repeat(auto-fill, minmax(100px, 1fr))"
          gap="1rem"
          mb="3rem"
        >
          {data?.nfts
            ?.filter((record) => !arrayOfMintedChars?.includes(record.mint))
            .map((record, i) => (
              <Frame
                key={record?.name + i}
                img={record?.cached_image_uri}
                select={() => select(record?.mint)}
              />
            ))}
          {isLoading && <Skeletons />}
        </Grid>
      </Box>
      <Flex gap="2rem">
        <Button w="100%" alignSelf="end" isDisabled>
          Select an NFT
        </Button>
      </Flex>
    </Flex>
  );
};

const Skeletons = () => {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton
          key={"loading" + i}
          h="100px"
          w="100px"
          borderRadius="0.5rem"
        />
      ))}
    </>
  );
};

const Thumbnail = styled(Grid)<{ isSelected?: boolean }>`
  background-color: ${colors.brand.primary};
  height: 100px;
  width: 100px;
  border: solid 0px transparent;
  border-radius: 0.5rem;
  place-items: center;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
  text-align: center; /* Add this line to center the text horizontally */
  :hover {
    border: solid 2px ${colors.brand.secondary};
  }
  transition: all 0.25s ease-in-out;

  p {
    font-size: 1.75rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.75);
  }
`;

const Header = styled(Text)`
  font-size: 32px;
  letter-spacing: 5px;
  font-family: ${fonts.header};
  text-transform: uppercase;
  font-weight: 900;
`;
