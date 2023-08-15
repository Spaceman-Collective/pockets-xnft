import { Flex, Text, Button } from "@chakra-ui/react";
import { FC } from "react";

export const Faction: FC<{ onOpenJoinFaction: () => void }> = ({
  onOpenJoinFaction,
}) => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="2rem"
      h="100%"
    >
      <Text mt="2rem" textAlign="center" fontSize="4rem">
        AW SHUCKS ANON,
        <br /> YOU’RE NOT IN A FACTION!
      </Text>
      <Button variant="outline" onClick={onOpenJoinFaction}>
        Join a Faction
      </Button>
      <Button variant="outline">Create a Faction</Button>
    </Flex>
  );
};
