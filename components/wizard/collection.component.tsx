import { colors, fonts } from "@/styles/defaultTheme";
import { Button, Grid, Flex, Text, Box } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { FC } from "react";
import { H3 } from ".";

export const SelectCollection: FC<{ next: () => void }> = ({
  next: nextStep,
}) => {
  return (
    <Flex direction="column" justifyContent="space-between" minH="60vh">
      <Box>
        <Header>Welcome Anon!</Header>
        <Text>
          Insert some random lore here or perhaps something about anons who are
          out of pocket. This is just filler text that can also be removed if
          wanted. That said it is nice to keep the container the same size from
          screen to screen so maybe keep this text.
        </Text>
        <H3 pt="4rem">Select a Collection:</H3>
        <Grid
          templateColumns="repeat(auto-fill, minmax(150px, 1fr))"
          gap="1rem"
          mb="3rem"
        >
          <Thumbnail cursor="pointer" onClick={nextStep}>
            Mad Lads
          </Thumbnail>
          <Thumbnail userSelect="none" cursor="not-allowed" opacity="0.5">
            Kyogen
          </Thumbnail>
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
  :hover {
    border: solid 2px ${colors.brand.secondary};
  }
  transition: all 0.25s ease-in-out;
`;

const Header = styled(Text)`
  font-size: 32px;
  letter-spacing: 5px;
  font-family: ${fonts.header};
  text-transform: uppercase;
  font-weight: 900;
`;
