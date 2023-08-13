import { Button, Grid, Flex, Text, Box } from "@chakra-ui/react";
import { FC } from "react";
import { H3 } from ".";
import { Lad } from "./wizard.components";

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
