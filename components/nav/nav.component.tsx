import dynamic from "next/dynamic";
import { Flex, Button, Text } from "@chakra-ui/react";
import Link from "next/link";

const LazyButtons = dynamic(() => import("./web3-buttons.component"), {
  ssr: false,
});

export const NavBar = () => {
  return (
    <Flex justifyContent="space-between" alignItems="center" my="2rem">
      <Link href="/">
        <Text fontWeight="400" letterSpacing="1px" fontSize="2.5rem">
          POCKETS
        </Text>
      </Link>
      <LazyButtons />
    </Flex>
  );
};
