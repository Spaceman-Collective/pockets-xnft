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
import { TransactionInstruction } from "@solana/web3.js";
import { FC, useCallback, useEffect, useState } from "react";
import { BN } from "@coral-xyz/anchor";
import { toast } from "react-hot-toast";
import { colors } from "@/styles/defaultTheme";
import Link from "next/link";
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
  const [jackpot, setJackpot] = useState<boolean>(false);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [rfAccount, setRfAccount] = useState<RFAccount>();
  const [signedArr, setSignedArr] = useState<string[]>();
  const [prospectLoading, setProspectLoading] = useState<boolean>(false);
  const [numProspectTickets, setNumProspectTickets] = useState<number>(0);
  const queryClient = useQueryClient();

  const refreshRFAccount = useCallback(async () => {
    if (!rf) return;

    try {
      const refetchRFAllocationData = await refetchRFAllocation();
      setDiscoverableData(refetchRFAllocationData.data);

      const account = await getRFAccount(connection, rf?.id);
      if (account?.initialClaimant) {
        if (account.initialClaimant.toString() == characterMint) {
          const hitJackpot =
            account?.initialClaimant?.toString() === characterMint;
          setJackpot(hitJackpot);
        }
        mutate({ charMint: account.initialClaimant.toString() });
      }
      setRfAccount(account as RFAccount);
    } catch (err) {
      console.error(err);
    }
  }, [connection, getRFAccount, rf, characterMint]);

  useEffect(() => {
    refreshRFAccount();
  }, [rfAccount, refreshRFAccount]);

  useEffect(() => {
    refreshRFAccount();
    refetchRFAllocation().then((data: any) => setDiscoverableData(data.data));
  }, [
    rf,
    connection,
    refreshRFAccount,
    refetchRFAllocation,
    setDiscoverableData,
  ]);

  const post = async () => {
    if (!characterMint || !factionId || !rf?.id || !walletAddress) {
      toast.error("Something is not right!");
      return;
    }

    try {
      setProspectLoading(true);

      let allTxs: TransactionInstruction[] = [];
      for (let txIdx = 0; txIdx < numProspectTickets; txIdx++) {
        let ix =
          buildProspectIx &&
          (await buildProspectIx({
            walletAddress,
            characterMint,
            factionId,
            rfId: rf?.id,
          }));

        if (!ix || ix === undefined) return;

        allTxs.push(ix);
      }

      let txIdx = 0;
      let sigArr: string[] = [];
      if (numProspectTickets > MAX_NUM_IX) {
        let numTransactions = Math.floor(numProspectTickets / MAX_NUM_IX);
        let remTransactions = Math.floor(numProspectTickets % MAX_NUM_IX);

        for (txIdx = 0; txIdx < numTransactions; txIdx++) {
          try {
            let txSlice = allTxs.slice(
              txIdx + (txIdx > 0 ? 1 : 0) * MAX_NUM_IX,
              (txIdx + 1) * MAX_NUM_IX
            );
            let sigs = await sendAllTransactions(
              connection,
              txSlice,
              walletAddress,
              signAllTransactions
            );
            sigArr.push(...sigs!);
          } catch (err) {
            console.error(err);
          }
        }

        if (remTransactions > 0) {
          let remainderTxSlice = allTxs.slice(
            txIdx * MAX_NUM_IX - (txIdx > 0 ? 1 : 0),
            allTxs.length
          );
          let sigs = await sendAllTransactions(
            connection,
            remainderTxSlice,
            walletAddress,
            signAllTransactions
          );
          sigArr.push(...sigs!);
        }
      } else {
        let sigs = await sendAllTransactions(
          connection,
          allTxs,
          walletAddress,
          signAllTransactions
        );
        sigArr.push(...sigs!);
      }

      setSignedArr(sigArr);
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * (signedArr ? signedArr?.length : 1))
      );
    } catch (err) {
      // Error could mean they got one
      await new Promise((resolve) => setTimeout(resolve, 15000));
      await refreshRFAccount();
      queryClient.refetchQueries({ queryKey: ["rf-allocation"] });
      console.error(err);
    } finally {
      await refreshRFAccount();
      toast.custom(
        "Successfully sent prospect TXs, but seems like none of them were winners"
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
            <VStack gap={4}>
              <Text textAlign={"center"}>
                Congrats, anon! You have claimed the resource field for your
                faction! This field has been added to your factions resource
                fields.
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

              <Flex w="100%" gap={3}>
                <Text pb="4" pt="8">
                  Your Txs:
                </Text>
                {signedArr
                  ?.filter((val, index) => index < 4)
                  .map((sig, index) => (
                    <Link
                      key={`sig-${index}`}
                      href={`https://solscan.io/tx/${sig}`}
                      target="_blank"
                    >
                      <StyledText>
                        {sig.slice(0, 4)}...
                        {sig.slice(sig.length - 4, sig.length)}
                      </StyledText>
                    </Link>
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

const StyledText = styled(Text)`
  :hover {
    color: ${colors.brand.tertiary};
  }
`;
