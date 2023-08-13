import { Flex, Button, Text } from "@chakra-ui/react";
import Link from "next/link";

export const NavBar = () => {
  return (
    <Flex justifyContent="space-between" alignItems="center" my="2rem">
      <Link href="/">
        <Text fontWeight="400" letterSpacing="1px" fontSize="2.5rem">
          POCKETS
        </Text>
      </Link>
      <Button variant="outline">0x....god</Button>
    </Flex>
  );
};
