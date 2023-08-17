import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Input,
  Flex,
} from "@chakra-ui/react";
import { FC } from "react";
import { GiMagnifyingGlass } from "react-icons/gi";
import styled from "@emotion/styled";
import { colors } from "@/styles/defaultTheme";
import { FactionBox } from "./faction-item.component";
import { useFetchAllFactions, useFetchAllFactionsDummy } from "@/hooks/useFetchAllFactions";
import { useJoinFaction } from "@/hooks/useJoinFaction";
import { useSolana } from "@/hooks/useSolana";
import { Character, Faction } from "@/types/server";

export const FactionModal: FC<{ isOpen: boolean; onClose: () => void; selectedCharacter?: Character | null}> = ({
  onClose,
  isOpen,
  selectedCharacter
}) => {
  // TODO: Uncomment this with for real fetch
  // const { data: numOfFactions } = useFetchAllFactions();
  const { data: numOfFactions } = useFetchAllFactionsDummy();

  const { connection, walletAddress, signTransaction, buildMemoIx, encodeTransaction } = useSolana();
  const { mutate } = useJoinFaction();

  const handleJoinClick = async (faction: Faction) => {
    const payload = {
      mint: selectedCharacter?.mint,
      timestamp: Date.now().toString(),
      factionId: faction.id
    };

    // console.log('[FactionModal] handleJoinClick payload: ', payload);

    const encodedSignedTx = await encodeTransaction({
      walletAddress,
      connection,
      signTransaction,
      txInstructions: [buildMemoIx({ walletAddress, payload })],
    });

    if (!encodedSignedTx) throw Error("No Tx");
    mutate({ signedTx: encodedSignedTx });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        p="1rem"
        minW={{ base: "95%", sm: "600px" }}
        minH="600px"
        maxH="800px"
        bg="blacks.500"
        color="brand.secondary"
        borderRadius="1rem"
        overflow="auto"
      >
        <ModalBody>
          <Flex
            mt="1rem"
            bg="brand.primary"
            borderRadius="1rem"
            alignItems="center"
          >
            <SearchBar
              placeholder="faction"
              _focus={{
                outline: "none",
              }}
            />
            <GiMagnifyingGlass
              fontSize="3rem"
              style={{ marginRight: "2rem" }}
            />
          </Flex>
          <Flex direction="column" mt="2rem" gap="2rem">
            {/* {Array.from({ length: 7 }).map((_, i) => (
              <FactionBox key={i + "faction"} joinFaction={handleJoinClick}/>
            ))} */}
            {numOfFactions.map((faction, i) => (
              <FactionBox key={i + "faction"} joinFaction={() => handleJoinClick(faction)} faction={faction}/>
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const SearchBar = styled(Input)`
  color: ${colors.brand.tertiary};
  background-color: inherit;
  border-radius: inherit;
  padding: 2rem;
  width: 100%;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 3px;

  :focus: {
    outline: none;
  }
`;
