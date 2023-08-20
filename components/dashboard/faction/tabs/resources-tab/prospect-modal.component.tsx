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
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { FC, useEffect, useState } from "react";
import { BN } from "@coral-xyz/anchor";
import { toast } from "react-hot-toast";
import { colors } from "@/styles/defaultTheme";
import Link from "next/link";
import { useRfAllocate } from "@/hooks/useRf";
import { Character } from "@/types/server";

const tickets = [ 1, 5, 10, 50, 100 ];
const MAX_NUM_IX = 20;

type RFAccount = {
  harvest: any | null;
  id: string;
  initalClaimant: string | null;
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
  refetchRF?: any;
  currentCharacter: Character;
}> = ({ isOpen, onClose, rf, charMint: characterMint, factionId, refetchRF, currentCharacter }) => {
  const {
    walletAddress,
    connection,
    signTransaction,
    buildProspectIx,
    getRFAccount,
    sendAllTransactions,
    signAllTransactions
  } = useSolana();

  const { mutate } = useRfAllocate();
  const [jackpot, setJackpot] = useState<boolean>(false);
  const [developLoading, setDevelopLoading] = useState<boolean>(false);
  const [rfAccount, setRfAccount] = useState<RFAccount>();
  const [signedArr, setSignedArr] = useState<string[]>();
  const [prospectLoading, setProspectLoading] = useState<boolean>(false);
  const [numProspectTickets, setNumProspectTickets] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      if (!rf?.id) return console.error("NO  ACCOUNT ID", rf);
      try {
        const account = await getRFAccount(connection, rf?.id);
        const parsedAcc = JSON.parse(JSON.stringify(account)) as RFAccount;
        setRfAccount(parsedAcc);
        setJackpot(parsedAcc.isHarvestable && parsedAcc.initalClaimant === walletAddress);
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, [rf, connection]);

  const handleJackpot = () => {
    try {
      setDevelopLoading(true);
      mutate({signedTx: undefined, charMint: currentCharacter.mint});
    } catch (err) {
      console.error(err);
    } finally {
      setDevelopLoading(false);
      onClose();
    }
  }

  const post = async () => {
    if (
      !signTransaction ||
      !characterMint ||
      !factionId ||
      !rf?.id ||
      !walletAddress
    )
      return;

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
        // console.log('numTransactions', numTransactions, 'remTransactions', remTransactions);

        for (txIdx = 0; txIdx < numTransactions; txIdx++) {
          try {
            // console.log('txIdx', txIdx);
            let txSlice = allTxs.slice(txIdx + (txIdx > 0 ? 1 : 0) * MAX_NUM_IX, ((txIdx + 1) * MAX_NUM_IX));
            let sigs = await sendAllTransactions(connection, txSlice, walletAddress, signAllTransactions);
            sigArr.push(...sigs!);
          } catch (err) {
            console.error(err);
          }
        }

        if (remTransactions > 0) {
          // console.log('[with remmainder] start', (txIdx * MAX_NUM_IX), "end:", allTxs.length);
          let remainderTxSlice = allTxs.slice((txIdx * MAX_NUM_IX) - (txIdx > 0 ? 1 : 0), allTxs.length);
          let sigs = await sendAllTransactions(connection, remainderTxSlice, walletAddress, signAllTransactions);
          sigArr.push(...sigs!);
        }
      } else {
        let sigs = await sendAllTransactions(connection, allTxs, walletAddress, signAllTransactions);
        sigArr.push(...sigs!);
      }

      //TODO: remove this log when building page
      console.info("SUCCESSFUL SIGN with sigs", sigArr);
      toast.success("Successfully sent prospect TXs");
      /* TODO have some array of sigs to be set */
      setSignedArr(sigArr);
    } catch (err) {
      console.error(err);
      toast.error("Error prospecting Resource Field");
    } finally {
      setProspectLoading(false);
    }
  };

  useEffect(() => {
    /* Everytime signed changes we have a successful signature - time to check if it's jackpot */
    (async () => {
      if (!rf?.id) return console.error("NO  ACCOUNT ID", rf);
      try {
        const account = await getRFAccount(connection, rf?.id);
        const parsedAcc = JSON.parse(JSON.stringify(account)) as RFAccount;
        setRfAccount(parsedAcc);
        setJackpot(parsedAcc.isHarvestable && parsedAcc.initalClaimant === walletAddress)
      } catch (err) {
        console.error(err);
      }
    })();
  }, [signedArr]);

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
        <ModalCloseButton display={{ base: "inline", md: "none" }} />
        <ModalBody>
          <Text>RF Account ID: {rfAccount?.id}</Text>
          <Flex
            mb="3rem"
            h="250px"
            justifyContent="end"
            gap={"6"}
            alignItems={"center"}
            flexDirection={"column"}
          >
            {jackpot ? (
              <>
                <Text>
                  Congratulations, you just developed this resource field
                </Text>
                <Button isLoading={developLoading} onClick={handleJackpot}>Develop</Button>
              </>
            ) : (
              <>
                <Text>How many prospect tickets?</Text>
                <Flex gap={"6"} justifyContent={"center"} mb="2rem">
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
                      setNumProspectTickets(event.target.value)
                    }
                  />
                  <Button
                    w="24"
                    onClick={() =>
                      setNumProspectTickets(numProspectTickets + 1)
                    }
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
              </>
            )}
          </Flex>
        </ModalBody>
        <ModalHeader>
          <Flex gap={3}>
            <Text pb={"1rem"}>Your Txs:</Text>
            {signedArr
              ?.filter((val, index) => index < 5) /* Show only top 5 txs */
              .map((sig, index) => (
                <Link
                  key={`sig-${index}`}
                  href={`https://solscan.io/tx/${sig}`}
                  target="_blank"
                >
                  <StyledText>
                    {sig.slice(0, 4)}...{sig.slice(sig.length - 4, sig.length)}
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
        </ModalHeader>
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