import { colors, fonts } from "@/styles/defaultTheme";
import { Button, Grid, Flex, Text, Box } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { FC } from "react";
import { H3 } from ".";
import { Tip } from "../tooltip";

export const SelectCollection: FC<{ next: () => void }> = ({
  next: nextStep,
}) => {
  return (
    <Flex direction="column" justifyContent="space-between" minH="60vh">
      <Box>
        <Header>Welcome!</Header>
        <Text>
          Before you begin your journey, you&apos;ll need to create a character
          profile using an NFT from one of the below approved collections.
          You&apos;ll be asked to generate a name and to sign a transaction.
          This will generate a character with randomly rolled skills to start
          you off!
        </Text>
        <H3 pt="4rem">Select a Collection:</H3>
        <Grid
          templateColumns="repeat(auto-fill, minmax(150px, 1fr))"
          gap="1rem"
          mb="3rem"
        >
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
      </Box>
      <Button w="100%" alignSelf="end" onClick={nextStep}>
        Continue
      </Button>
    </Flex>
  );
};

const Thumbnail = styled(Grid)<{ isSelected?: boolean }>`
  background-color: ${colors.brand.primary};
  height: 150px;
  width: 150px;
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
    font-size: 3rem;
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
