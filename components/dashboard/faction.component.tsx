import { useEffect, useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { useSolana } from "@/hooks/useSolana";
import { useCreateFaction } from "@/hooks/useCreateFaction";
import { CreateFaction } from "./createfaction.component";
import Confetti from "@/components/Confetti";


export const Faction = () => {

  const { handleSignTransaction } = useSolana();

  const { mutate } = useCreateFaction();
  

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
    >
      <Text mt="2rem" textAlign="center" fontSize="1.5rem">
        AW SHUCKS ANON, YOU’RE NOT IN A FACTION!
      </Text>
      <Button
        mt="1rem"
        bg={colors.brand.primary}
        borderRadius="0.5rem"
        p="0.5rem"
        fontSize="1.25rem"
        fontWeight={600}
        letterSpacing="1px"
        width="12rem"
        onClick={() => {}}
      >
        Join a Faction
      </Button>
      <CreateFaction/>
    </Box>
  );
};
