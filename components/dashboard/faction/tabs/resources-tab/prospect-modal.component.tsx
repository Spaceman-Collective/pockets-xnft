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
import { getResourceField } from "@/lib/solanaClient";
import Link from "next/link";

const tickets = [ 1, 5, 10, 50, 100 ];
const MAX_NUM_IX = 30;

type RFAccount = {
  harvest: any | null;
  id: string;
  initialClaimant: PublicKey | null;
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
}> = ({ isOpen, onClose, rf, charMint: characterMint, factionId }) => {
  const {
    walletAddress,
    connection,
    signTransaction,
    buildProspectIx,
    getRFAccount,
    sendTransaction,
  } = useSolana();

  const [rfAccount, setRfAccount] = useState<RFAccount>();
  const [signedArr, setSignedArr] = useState<string[]>();
  const [prospectLoading, setProspectLoading] = useState<boolean>(false);
  const [numProspectTickets, setNumProspectTickets] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      if (!rf?.id) return console.error("NO  ACCOUNT ID", rf);
      try {
        const account = await getRFAccount(connection, rf?.id);
        setRfAccount(JSON.parse(JSON.stringify(account)) as RFAccount);
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, [rf, connection]);

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
      const sigArr: string[] = [...signedArr ?? []];
      const txNum = Math.floor(numProspectTickets / MAX_NUM_IX);
      const ixRemainder = numProspectTickets % MAX_NUM_IX;

      let ixArr: TransactionInstruction[] = [];
      if (txNum > 0) {
        for (let txIdx = 0; txIdx < txNum; txIdx++) {
          // sleep for 2 seconds in between txs
          await new Promise((resolve) => setTimeout(resolve, 2000));

          for (let i = 0; i < MAX_NUM_IX; i++) {
            let ix =
              buildProspectIx &&
              (await buildProspectIx({
                walletAddress,
                characterMint,
                factionId,
                rfId: rf?.id,
              }));

            if (!ix || ix === undefined) return;

            ixArr.push(ix);
          }

          try {
            const sig = await sendTransaction(
              connection,
              ixArr,
              walletAddress,
              signTransaction
            );

            sigArr.push(sig ?? "");
          } catch (error) {
            console.error(error);
          }
        }

        /* Take care of the remainder of Ixs in one last Tx */
        console.log("[doing the remainder ix]");
        for (let i = 0; i < ixRemainder; i++) {
          let ix =
            buildProspectIx &&
            (await buildProspectIx({
              walletAddress,
              characterMint,
              factionId,
              rfId: rf?.id,
            }));

          if (!ix || ix === undefined) return;

          ixArr.push(ix);
        }
      } else {
        console.log("[doing only one TX]");
        for (let i = 0; i < ixRemainder; i++) {
          let ix =
            buildProspectIx &&
            (await buildProspectIx({
              walletAddress,
              characterMint,
              factionId,
              rfId: rf?.id,
            }));

          if (!ix || ix === undefined) return;

          ixArr.push(ix);
        }
      }

      const sig = await sendTransaction(
        connection,
        ixArr,
        walletAddress,
        signTransaction
      );

      sigArr.push(sig ?? "");
      //TODO: remove this log when building page
      console.info("SUCCESSFUL SIGN with sigs", sigArr);
      for (let sig of sigArr) {
        toast.success(sig ?? "");
      }
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
      if (!signedArr) return;

      for (let sig of signedArr) {
        // TODO - currently broken!
        let rfAcc = await getResourceField(rf?.id);
        // let rfAcc = {};
        console.log("[rfAcc]", rfAcc);
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
              <StyledInput value={numProspectTickets} type="number" />
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
          </Flex>
        </ModalBody>
        <ModalHeader>
          <Flex gap={3}>
            <Text pb={"1rem"}>Your Txs:</Text>
            {signedArr?.map((sig, index) => (
              <Link key={`sig-${index}`} href={`https://solscan.io/tx/${sig}`} target="_blank">
                <StyledText>{sig.slice(0,4)}...{sig.slice(sig.length - 4, sig.length)}</StyledText>
              </Link>
            ))}
          </Flex>

          <Button isLoading={prospectLoading} w="100%" onClick={post}>
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