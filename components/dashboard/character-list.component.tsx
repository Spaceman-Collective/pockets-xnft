import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Text } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import {
    CharacterListContainer,
  } from "@/components/Containers.styled";

export const CharacterList = () => {
  const router = useRouter();
  const [actionStatus, setActionStatus] = useState(false);


  return (
    <CharacterListContainer>
    <Button
      variant="solid"
      width="100%"
      onClick={() => router.push("/wizard")}
    >
      Character +
    </Button>
    <Text>
      insert character list here
    </Text>
    <Button
      variant="outline"
      width="100%"
      disabled={!actionStatus}
      onClick={() => {}}
    >
      Confirm
    </Button>
  </CharacterListContainer>
  );
};
