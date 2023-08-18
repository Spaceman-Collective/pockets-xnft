import { FC, useState } from "react";
import { Flex, Text, Button } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { CreateFaction } from "./create-faction.component";
import Confetti from "@/components/Confetti";
import { timeout } from "@/lib/utils";
import { useCharacter} from "@/hooks/useCharacter";
import { Character } from "@/types/server";

export const NoFaction: FC<{ onOpenJoinFaction: () => void; setFactionStatus: (value: boolean) => void;
}> = ({
  onOpenJoinFaction,
  setFactionStatus
}) => {
  const [confetti, setConfetti] = useState(false);
  const fireConfetti = async () => {
    if (confetti) return;
    setConfetti(true);
    await timeout(3600);
    setConfetti(false);
  };
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="2rem"
      h="100%"
    >
      <Text
        textAlign="center"
        fontSize="3rem"
        fontWeight="800"
        maxWidth="50rem"
        letterSpacing="1px"
      >
        AW SHUCKS ANON,
        <br /> YOU’RE NOT IN A FACTION!
      </Text>
      <Button
        cursor="pointer"
        bg={colors.brand.tertiary}
        borderRadius="0.5rem"
        mt="1rem"
        p="1rem"
        width="40rem"
        fontSize="2rem"
        fontWeight={600}
        letterSpacing="1px"
        onClick={onOpenJoinFaction}
      >
        Join a Faction
      </Button>
      <CreateFaction fire={fireConfetti} setFactionStatus={setFactionStatus} />
      {confetti && <Confetti canFire={confetti} />}
    </Flex>
  );
};

export const NoSelectedCharacter: FC<{}> = ({}) => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="2rem"
      h="100%"
    >
      <Text
        textAlign="center"
        fontSize="3rem"
        fontWeight="800"
        maxWidth="50rem"
        letterSpacing="1px"
      >
        AW SHUCKS ANON,
        <br /> SELECT A DARN CHARACTER, WILL YA?
      </Text>
    </Flex>
  );
};
