import { Box, Text, HStack } from "@chakra-ui/react";
import { FavorAction, Label, MenuText, Value } from "./wallet-page.styles";

export const WalletFavorPanel = () => {
  return (
    <Box>
      {Array.from({ length: 3 }).map((_, i) => (
        <FavorAction key={"res" + i}>
          <Text>#{i + 1}</Text>
          <HStack>
            <Label>reward:</Label>
            <Value>
              10<span> GOLD</span>
            </Value>
          </HStack>
          <HStack>
            <Label>cost:</Label>
            <Value>
              1000000<span> BONK</span>
            </Value>
          </HStack>
          <MenuText
            color={"brand.quaternary"}
            cursor={i > 1 ? "not-allowed" : "pointer"}
          >
            complete
          </MenuText>
        </FavorAction>
      ))}
    </Box>
  );
};
