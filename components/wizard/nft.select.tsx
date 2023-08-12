import { colors } from "@/styles/defaultTheme";
import { Button, Grid, Flex, Text, Box } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { FC } from "react";

export const SelectNFT: FC<{ back: () => void; next: () => void }> = ({
  next: nextStep,
  back: backStep,
}) => {
  return (
    <Flex direction="column" justifyContent="space-between" minH="60vh">
      <Box>
        <Text>
          Insert some random lore here or perhaps something about anons who are
          out of pocket. This is just filler text that can also be removed if
          wanted. That said it is nice to keep the container the same size from
          screen to screen so maybe keep this text.
        </Text>
        <H3 pt="4rem">NFTs</H3>
        <Grid
          templateColumns="repeat(auto-fill, minmax(150px, 1fr))"
          gap="1rem"
          mb="3rem"
        >
          <Thumbnail>Mad Lads</Thumbnail>
          <Thumbnail>Kyogen</Thumbnail>
          <Thumbnail />
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

const H3 = styled(Text)`
  text-transform: uppercase;
  font-weight: 700;
  margin: 1rem 0;
`;
