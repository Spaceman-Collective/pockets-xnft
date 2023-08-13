import { Button, Grid, Flex, Text, Box, Skeleton } from "@chakra-ui/react";
import { FC } from "react";
import { H3 } from ".";
import { Frame, Lad } from "./wizard.components";
import type { NFT } from "@/types/server";

export const SelectNFT: FC<{
  back: () => void;
  next: () => void;
  data?: { nfts?: NFT[]; character?: any[] };
  isLoading?: boolean;
  select: (mint: string) => void;
}> = ({ next: nextStep, back: backStep, data, isLoading, select }) => {
  return (
    <Flex direction="column" justifyContent="space-between" minH="60vh">
      <Box>
        <Text>
          Select from one of your <strong>Mad Lads</strong> to create a
          Character with. You will be asked to sign a message on the next screen
          to confirm.
        </Text>

        <H3 pt="4rem">Characters</H3>
        <Grid
          templateColumns="repeat(auto-fill, minmax(100px, 1fr))"
          gap="1rem"
          mb="3rem"
        >
          {data?.character?.map((record, i) => (
            <Frame
              key={record?.name + i}
              img={record?.cached_image_uri}
              select={() => {}}
            />
          ))}
          {isLoading && <Skeletons />}
        </Grid>
        <H3 pt="4rem">NFTs</H3>
        <Grid
          templateColumns="repeat(auto-fill, minmax(100px, 1fr))"
          gap="1rem"
          mb="3rem"
        >
          {data?.nfts?.map((record, i) => (
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
        <Button variant="outline" w="100%" alignSelf="end" onClick={backStep}>
          Back
        </Button>
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
