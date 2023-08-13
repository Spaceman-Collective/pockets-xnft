import { Flex, Button, Text } from "@chakra-ui/react";

export const NavBar = () => {
  return (
    <Flex justifyContent="space-between" alignItems="center" my="2rem">
      <Text fontWeight="400" letterSpacing="1px" fontSize="2.5rem">
        POCKETS
      </Text>
      <Button variant="outline">0x....god</Button>
    </Flex>
  );
};
