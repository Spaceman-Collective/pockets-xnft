import { useSolana } from "@/hooks/useSolana";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  ModalHeader,
  Flex,
  Input,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { FC, useCallback, useEffect, useState } from "react";
import { BN } from "@coral-xyz/anchor";
import { toast } from "react-hot-toast";
import { colors } from "@/styles/defaultTheme";
import { useRfAllocate } from "@/hooks/useRf";
import { Character } from "@/types/server";
import { useQueryClient } from "@tanstack/react-query";

const tickets = [1, 5, 10, 25];
const MAX_NUM_IX = 20;

type RFAccount = {
  harvest: any | null;
  id: string;
  initialClaimant: string | null;
  isHarvestable: boolean;
  refreshSeconds: BN | null;
  timesDeveloped: BN;
};

export const ModalRfProspect: FC<{
  isOpen: boolean;
  onClose: () => void;
  rf?: { rfCount: number; id: string };
  charMint?: string;
  factionId?: string;
  currentCharacter: Character;
  fire: () => void;
  setDiscoverableData: Function;
  refetchRFAllocation: Function;
}> = ({
  isOpen,
  onClose,
  rf,
  charMint: characterMint,
  factionId,
  currentCharacter,
  fire: fireConfetti,
  setDiscoverableData,
  refetchRFAllocation,
}) => {
  const {
    walletAddress,
    connection,
    buildProspectIx,
    getRFAccount,
    sendAllTransactions,
    signAllTransactions,
  } = useSolana();

  const { mutate } = useRfAllocate();
  const queryClient = useQueryClient();

  const [jackpot, setJackpot] = useState<boolean>(false);
  const [rfAccount, setRfAccount] = useState<RFAccount>();
  const [signedArr, setSignedArr] = useState<string[]>();
  const [prospectLoading, setProspectLoading] = useState<boolean>(false);
  const [numProspectTickets, setNumProspectTickets] = useState<number>(0);

  const refreshRFAccount = useCallback(async () => {
    if (!rf) return;

    try {
      const refetchRFAllocationData = await refetchRFAllocation();
      setDiscoverableData(refetchRFAllocationData.data);

      const account = await getRFAccount(connection, rf?.id);
      if (
        account?.initialClaimant &&
        account.initialClaimant.toString() === characterMint
      ) {
        setJackpot(true);
        mutate({ charMint: account.initialClaimant.toString() });
        toast.success("You hit a winner!");
        fireConfetti();
        queryClient.refetchQueries({ queryKey: ["rf-allocation"] });
      }
      setRfAccount(account as RFAccount);
    } catch (err) {
      console.error(err);
    }
  }, [
    rf,
    refetchRFAllocation,
    setDiscoverableData,
    getRFAccount,
    connection,
    characterMint,
    mutate,
  ]);

  useEffect(() => {
    if (!rfAccount) {
      refreshRFAccount();
    }
    refetchRFAllocation().then((data: any) => setDiscoverableData(data.data));
  }, [
    rf,
    connection,
    refreshRFAccount,
    refetchRFAllocation,
    setDiscoverableData,
    rfAccount,
  ]);

  const post = async () => {
    if (!characterMint || !factionId || !rf?.id || !walletAddress) {
      toast.error("Something is not right!");
      return;
    }

    try {
      setProspectLoading(true);
      const allTxs = await Promise.all(
        Array(numProspectTickets)
          .fill(0)
          .map(() =>
            buildProspectIx({
              walletAddress,
              characterMint,
              factionId,
              rfId: rf?.id,
            }),
          ),
      );

      const sendTransactionsInChunks = async (transactions: any[]) => {
        let sigArr: string[] = [];
        for (let i = 0; i < transactions.length; i += MAX_NUM_IX) {
          const txSlice = transactions.slice(i, i + MAX_NUM_IX);
          const sigs = await sendAllTransactions(
            connection,
            txSlice,
            walletAddress,
            signAllTransactions,
          );
          if (sigs) {
            sigArr.push(...sigs);
          }
        }
        return sigArr;
      };

      const sigArr = await sendTransactionsInChunks(allTxs);
      setSignedArr(sigArr);
      await new Promise((resolve) => setTimeout(resolve, 1000 * sigArr.length));
    } catch (err) {
      console.error(err);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 15000));
      await refreshRFAccount();
      queryClient.refetchQueries({ queryKey: ["rf-allocation"] });
      toast.custom(
        "Successfully sent prospect TXs, but seems like none of them were winners",
      );
      setProspectLoading(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="blacks.500"
        p="2rem"
        borderRadius="1rem"
        minW="40vw"
        minH="40vh"
      >
        <ModalHeader fontSize="24px" fontWeight="bold" letterSpacing="3px">
          Prospect Resource Field
        </ModalHeader>
        <ModalCloseButton display={{ base: "inline", md: "none" }} />
        <ModalBody
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
        >
          <Text>
            Take a chance to claim this resource field for your faction. Even if
            you fail, you increase chance the next transaction will successfully
            claim the resource field. CURRENTLY NOT SUPPORTED ON LEDGER.
          </Text>
          <br></br>
          <Text>
            Every roll has a 1 in 1000 chance plus the times developed to land
            on a winning transaction. If it doesnt win, it increments times
            developed for the next transaction.
          </Text>
          <br></br>
          <Text>RF ID: {rfAccount?.id}</Text>
          <Text>Times Developed: {rfAccount?.timesDeveloped.toString()}</Text>
          {jackpot ? (
            <VStack
              gap={4}
              bg="green.700"
              fontWeight={700}
              p="1.5rem"
              borderRadius="1rem"
            >
              <Text>
                Congrats, anon! <br />
                You have claimed the resource field for your faction! This field
                has been added to your factions resource fields.
              </Text>
            </VStack>
          ) : (
            <VStack pt="28">
              <Text>How many transactions do you want to try?</Text>
              <Flex gap={"6"} justifyContent={"center"} my="2rem">
                <Button
                  w="24"
                  onClick={() => {
                    if (numProspectTickets > 0)
                      setNumProspectTickets(numProspectTickets - 1);
                  }}
                >
                  -
                </Button>
                <StyledInput
                  value={numProspectTickets}
                  type="number"
                  onChange={(event) =>
                    setNumProspectTickets(Number(event.target.value))
                  }
                />
                <Button
                  w="24"
                  onClick={() => setNumProspectTickets(numProspectTickets + 1)}
                >
                  +
                </Button>
              </Flex>
              <Flex gap={"6"} justifyContent={"center"} flexDir={"row"}>
                {tickets.map((ticket) => (
                  <Button
                    size={"md"}
                    key={ticket}
                    onClick={() => setNumProspectTickets(ticket)}
                  >
                    {ticket}
                  </Button>
                ))}
              </Flex>

              <Button
                isLoading={prospectLoading}
                isDisabled={jackpot}
                w="100%"
                onClick={post}
              >
                Prospect
              </Button>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const StyledInput = styled(Input)`
  background-color: ${colors.brand.tertiary};
  height: 5rem;
  width: 30%;
  border-radius: 4px;
  padding: 1rem 2rem;
  font-weight: 500;
  letter-spacing: 1px;
`;
