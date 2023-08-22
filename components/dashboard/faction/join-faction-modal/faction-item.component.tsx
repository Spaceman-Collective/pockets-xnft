import { useJoinFaction } from "@/hooks/useJoinFaction";
import { useSolana } from "@/hooks/useSolana";
import { Character, Faction } from "@/types/server";
import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { toast } from "react-hot-toast";

interface FactionBoxProps {
  onClose: () => void;
  faction: Faction;
  characterMint?: string;
  setFactionStatus: (value: boolean) => void;
}

export const FactionBox: FC<FactionBoxProps> = ({
  onClose,
  faction,
  characterMint,
  setFactionStatus,
}) => {
  const {
    connection,
    walletAddress,
    signTransaction,
    buildMemoIx,
    encodeTransaction,
  } = useSolana();

  const { mutate } = useJoinFaction();

  const queryClient = useQueryClient();
  const onSuccess = (data: any) => {
    queryClient.refetchQueries({ queryKey: ["assets"] });
    toast.success("Successfully joined faction:" + faction.name);
    setFactionStatus(true);
    onClose();
  };

  const handleJoinFaction = async () => {
    const payload = {
      mint: characterMint,
      timestamp: Date.now().toString(),
      factionId: faction?.id,
    };

    if (!walletAddress) return console.error("no wallet");
    const encodedSignedTx = await encodeTransaction({
      walletAddress,
      connection,
      signTransaction,
      txInstructions: [buildMemoIx({ walletAddress, payload })],
    });

    if (!encodedSignedTx || encodedSignedTx instanceof Error)
      return toast.error("Did not join Faction");
    mutate(
      { signedTx: encodedSignedTx },
      {
        onSuccess,
        onError: (e) => toast.error("Did not join faction:" + e?.toString()),
      },
    );
  };

  return (
    <>
      <Flex
        bg="brand.primary"
        w="100%"
        h="13rem"
        borderRadius="0.5rem"
        alignItems="center"
        justifyContent="space-between"
        p="2rem"
      >
        <Flex gap="2rem" alignItems="center">
          <Box
            bg="blacks.500"
            h="10rem"
            w="10rem"
            backgroundImage={faction.image}
            backgroundPosition="center"
            backgroundSize="cover"
            borderRadius="0.5rem"
          />
          <Box>
            <Text textTransform="uppercase" fontSize="1.25rem">
              population{" "}
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "2rem",
                  marginLeft: "0.5rem",
                }}
              >
                {/* TODO - shouldn't we have faction pop in `faction` */}
                12
              </span>
            </Text>
            <Text textTransform="uppercase" fontSize="2.5rem" fontWeight={700}>
              {faction.name}
            </Text>
            <Text
              color="brand.tertiary"
              letterSpacing="0.25rem"
              textTransform="uppercase"
              fontSize="1.5rem"
              textDecor="underline"
            >
              {faction.external_link}
            </Text>
          </Box>
        </Flex>
        <Box>
          <Button onClick={handleJoinFaction}>join</Button>
        </Box>
      </Flex>
    </>
  );
};
