import {
  BONK_MINT,
  RESOURCE_FIELD_CREATION_MULTIPLIER,
  SERVER_KEY,
} from "@/constants";
import { useRfAllocate } from "@/hooks/useRf";
import { useSolana } from "@/hooks/useSolana";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  HStack,
  ModalHeader,
  Flex,
  Box,
  ModalFooter,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { formatBalance } from "@/lib/utils";
import { toast } from "react-hot-toast";

export const ModalRfDiscover: FC<{
  isOpen: boolean;
  onClose: () => void;
  rf?: { rfCount: number };
  setDiscoverableData: Function;
  refetchRFAllocation: Function;
}> = ({ isOpen, onClose, rf, setDiscoverableData, refetchRFAllocation }) => {
  const { mutate } = useRfAllocate();
  const {
    walletAddress,
    connection,
    signTransaction,
    buildTransferIx,
    encodeTransaction,
  } = useSolana();

  const [discoverLoading, setDiscoverLoading] = useState<boolean>(false);

  const rfCount = typeof rf?.rfCount === "number" ? rf?.rfCount : 0;
  const bonkForNextField =
    (BigInt(rfCount) * RESOURCE_FIELD_CREATION_MULTIPLIER) / BigInt(1e5);

  const post = async () => {
    try {
      setDiscoverLoading(true);
      let ix =
        buildTransferIx &&
        (await buildTransferIx({
          walletAddress: walletAddress as string,
          connection,
          receipientAddress: SERVER_KEY,
          mint: BONK_MINT.toString(),
          decimals: 5,
          amount: bonkForNextField * BigInt(1e5),
        }));

      if (!ix) return;
      const encodedTx = await encodeTransaction({
        txInstructions: [...ix],
        walletAddress,
        connection,
        signTransaction,
      });

      if (typeof encodedTx == "string") {
        mutate({
          signedTx: encodedTx,
          charMint: undefined,
        });
        await new Promise((resolve) => setTimeout(resolve, 1500)); //wait so the account gets initialized on the blockchain
        toast.success("Successfully allocated Resource Field");
        refetchRFAllocation().then((data: any) =>
          setDiscoverableData(data.data),
        );
      } else {
        throw Error("failed tx");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error allocating Resource Field");
    } finally {
      setDiscoverLoading(false);
      onClose();
    }
  };

  // TODO: DEV update the below with tooltips
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="blacks.500"
        p="2rem"
        borderRadius="1rem"
        minW="40vw"
        minH="25vh"
      >
        <ModalHeader fontSize="24px" fontWeight="bold" letterSpacing="3px">
          Discover Resource Field
        </ModalHeader>
        <ModalCloseButton display={{ base: "inline", md: "none" }} />
        <ModalBody display={"flex"} flexDirection={"column"} gap="2rem">
          <Text>
            Resource Fields, when controlled by a faction, allow that faction’s
            citizens to harvest it every so often for it’s yield.
          </Text>
          <Text>
            There are currently {rf?.rfCount} already discovered fields.
          </Text>
          <HStack>
            <Text>BONK for next Resource Field:</Text>
            <Text>{formatBalance(Number(bonkForNextField))}</Text>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button isLoading={discoverLoading} w="100%" onClick={post}>
            Allocate
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
