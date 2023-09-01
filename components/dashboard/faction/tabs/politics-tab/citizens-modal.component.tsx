import { Frame } from "@/components/wizard/wizard.components";
import { Character } from "@/types/server";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Grid,
  Flex,
  Box,
  HStack,
  IconButton,
  Tooltip,
  Input,
  Button,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import styled from "@emotion/styled";
import { MdCheck, MdPersonAddAlt1, MdSend, MdRefresh } from "react-icons/md";
import { colors } from "@/styles/defaultTheme";
import { Label, Value } from "../tab.styles";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PublicKey } from "@solana/web3.js";
import { useSolana } from "@/hooks/useSolana";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";
import { delegateVotes, transferVotes } from "@/lib/solanaClient";

export const CitizenModal: FC<{
  citizens: Character[];
  onClose: () => void;
  isOpen: boolean;
}> = ({ citizens, onClose, isOpen }) => {
  const [actionType, setActionType] = useState<"delegate" | "transfer" | null>(
    null
  );
  const [activeCitizen, setActiveCitizen] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const [selectedCharacter] = useSelectedCharacter();
  const { walletAddress } = useSolana();


  const handleTransferVotes = async (voteAmt: number, voteCharacterRecepientMint: string) => {
    try {
      const voteTransferIx = await transferVotes(
        new PublicKey(walletAddress!),
        new PublicKey(selectedCharacter?.mint!),
        voteAmt,
        new PublicKey(voteCharacterRecepientMint)
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (typeof voteTransferIx === "string") {
        console.log('transfer ix: ' , voteTransferIx);
        toast.success("Transfer vote successful!");
      } else {
        console.log('error with transfer ix: ' , voteTransferIx);
        toast.error("Transfer vote failed!");
      }
      await new Promise((resolve) => setTimeout(resolve, 15000));

    } catch (e) {
      console.log("Transfer vote failed: ", e);
      toast.error("Transfer vote failed");
    } finally {
      setActionType(null);
      setActiveCitizen(null);
    }
  };

  const handleDelegateVotes = async (voteAmt: number, voteCharacterRecepientMint: string) => {
    try {
      const voteTransferIx = await delegateVotes(
        new PublicKey(walletAddress!),
        new PublicKey(selectedCharacter?.mint!),
        voteAmt,
        new PublicKey(voteCharacterRecepientMint)
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (typeof voteTransferIx === "string") {
        console.log('Delegate ix: ' , voteTransferIx);
        toast.success("Delegate vote successful!");
      } else {
        console.log('Error with delegate ix: ' , voteTransferIx);
        toast.error("Delegate vote failed!");
      }
      await new Promise((resolve) => setTimeout(resolve, 15000));

    } catch (e) {
      console.log("Delegate vote failed with error: ", e);
      toast.error("Delegate vote failed");
    } finally {
      setActionType(null);
      setActiveCitizen(null);
    }
  };

  const handleReclaimDelegatedVotes = () => {
    setActionType(null);
    setActiveCitizen(null);
  };

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
          <Box mb="2rem">
            <HStack justifyContent="space-between" align="end">
              <Text fontSize="3rem" fontWeight={800} letterSpacing="4px">
                CITIZENS
              </Text>
              <HStack pb="0.25rem">
                <CitizenLabel fontSize="2rem"> POPULATION: </CitizenLabel>
                <CitizenValue> {citizens.length}</CitizenValue>
              </HStack>
              <HStack pb="0.25rem">
                <CitizenLabel>Total Skills: </CitizenLabel>
                <Text
                  fontSize="2rem"
                  fontWeight={700}
                  bg="brand.quaternary"
                  color="brand.primary"
                  w="fit-content"
                  p="0rem 1.5rem"
                  borderRadius="1rem"
                  filter="drop-shadow(0 2px 2px rgba(0,0,0,0.25))"
                >
                  {citizens?.length > 0 &&
                    citizens
                      .map((e) =>
                        Object.values(e.skills).reduce((a, b) => a + b)
                      )
                      .reduce((a, b) => a + b)}
                </Text>
              </HStack>
            </HStack>
          </Box>
          <Grid
            templateColumns="repeat(auto-fill, minmax(12rem, 1fr))"
            gap="1rem"
          >
            {citizens.map((citizen) => (
              <Flex direction="column" key={citizen.mint} position="relative">
                <Frame img={citizen.image} />
                <Tooltip label="Skills" hasArrow>
                  <Text
                    position="absolute"
                    top="-0.5rem"
                    left="-0.5rem"
                    fontSize="1.75rem"
                    fontWeight={700}
                    bg="brand.quaternary"
                    color="brand.primary"
                    w="fit-content"
                    p="0 1rem"
                    borderRadius="0.5rem"
                    filter="drop-shadow(0 2px 2px rgba(0,0,0,0.25))"
                  >
                    {Object.values(citizen.skills).reduce((a, b) => a + b)}
                  </Text>
                </Tooltip>

                <Tooltip label="Reclaim Delegated Votes" hasArrow>
                  <IconButton
                    position="absolute"
                    bottom="12rem"
                    left="1rem"
                    aria-label="Confirm"
                    icon={<MdRefresh />}
                    bg={colors.blacks[700]}
                    borderRadius="0.5rem"
                    color="white"
                    p="0.5rem 0.5rem"
                    _hover={{ bg: colors.blacks[700] }}
                    onClick={() => handleReclaimDelegatedVotes()}
                  />
                </Tooltip>

                <Tooltip label="Delegated Votes" hasArrow>
                  <Text
                    position="absolute"
                    bottom="12rem"
                    right="1.5rem"
                    fontSize="1.75rem"
                    fontWeight={700}
                    bg={colors.blacks[700]}
                    color="brand.secondary"
                    w="fit-content"
                    p="0 0.5rem"
                    borderRadius="0.5rem"
                    filter="drop-shadow(0 2px 2px rgba(0,0,0,0.25))"
                  >
                    {Object.values(citizen.skills).reduce((a, b) => a + b)}
                  </Text>
                </Tooltip>

                <Flex
                  direction="column"
                  position="relative"
                  mt="1rem"
                  mb="0.5rem"
                >
                  <Text
                    noOfLines={1}
                    textOverflow="ellipsis"
                    fontFamily="header"
                    fontSize="1.75rem"
                    letterSpacing="3px"
                    fontWeight="100"
                  >
                    {citizen.name.split(" ")[0]}
                  </Text>
                  <Text
                    noOfLines={1}
                    textOverflow="ellipsis"
                    fontFamily="header"
                    letterSpacing="1px"
                    fontWeight="800"
                    fontSize="1.5rem"
                    textTransform="uppercase"
                  >
                    {citizen.name.split(" ")[1]}
                  </Text>
                </Flex>

                <Flex mt="1rem" justifyContent="space-between">
                  {actionType && activeCitizen === citizen.mint ? (
                    <Flex mr="0.5rem">
                      <StyledInput
                        placeholder="Amount"
                        type="number"
                        w="8rem"
                      />
                      <IconButton
                        aria-label="Confirm"
                        icon={<MdCheck />}
                        bg={colors.brand.quaternary}
                        borderRadius="0rem 0.5rem 0.5rem 0rem"
                        color="white"
                        p="0rem 1rem"
                        h="4rem"
                        _hover={{ bg: colors.blacks[700] }}
                        onClick={() => {
                          if (actionType == "delegate") {
                            handleTransferVotes(1, citizen.mint);
                          } else if (actionType == "transfer") {
                            handleDelegateVotes(1, citizen.mint);
                          }
                        }}
                      />
                    </Flex>
                  ) : (
                    <>
                      <Tooltip label="Delegate Votes" hasArrow>
                        <IconButton
                          aria-label="Delegate Votes"
                          icon={<MdPersonAddAlt1 />}
                          bg={colors.blacks[700]}
                          color="white"
                          p="0rem 2rem"
                          h="4rem"
                          onClick={() => {
                            setActionType("delegate");
                            setActiveCitizen(citizen.mint);
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Transfer Votes" hasArrow>
                        <IconButton
                          aria-label="Transfer Votes"
                          icon={<MdSend />}
                          bg={colors.blacks[700]}
                          color="white"
                          p="0rem 2rem"
                          h="4rem"
                          mr="0.5rem"
                          onClick={() => {
                            setActionType("transfer");
                            setActiveCitizen(citizen.mint);
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
                </Flex>
              </Flex>
            ))}
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const CitizenLabel = styled(Text)`
  font-size: 1.5rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;
export const CitizenValue = styled(Text)`
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const inputStyles = {
  backgroundColor: colors.blacks[600],
  height: "4rem",
  width: "100%",
  borderRadius: "0.5rem 0rem 0rem 0.5rem",
  padding: "0.5rem 1rem",
  fontWeight: "500",
  fontSize: "10px",
  letterSpacing: "1px",
  color: colors.brand.secondary,
};

const StyledInput = styled(Input)`
  ${inputStyles}

  &:disabled {
    background-color: ${colors.blacks[500]} !important;
  }
`;
