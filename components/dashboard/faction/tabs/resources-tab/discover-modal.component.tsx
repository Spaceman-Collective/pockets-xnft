import { BONK_MINT, RESOURCE_FIELD_CREATION_MULTIPLIER } from "@/constants";
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
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { formatBalance } from "@/lib/utils";
import { toast } from "react-hot-toast";

export const ModalRfDiscover: FC<{
  isOpen: boolean;
  onClose: () => void;
  rf?: { rfCount: number };
}> = ({ isOpen, onClose, rf }) => {
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
        buildTransferIx({
          walletAddress,
          mint: BONK_MINT.toString(),
          decimals: 5,
          amount: bonkForNextField * BigInt(1e5),
        });

      if (!ix) return;
      const encodedTx = await encodeTransaction({
        txInstructions: [ix],
        walletAddress,
        connection,
        signTransaction,
      });

      mutate({
        signedTx: encodedTx ?? "",
      });

      toast.success('Successfully allocated Resource Field');
    } catch (error) {
      console.error(error);
      toast.error("Error allocating Resource Field");
    } finally {
      setDiscoverLoading(false);
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
        <ModalCloseButton display={{ base: "inline", md: "none" }} />
        <ModalBody>
          <Text>There are {rf?.rfCount} fields.</Text>
          <HStack>
            <Text>BONK for next Resource Field:</Text>
            <Text>{formatBalance(Number(bonkForNextField))}</Text>
          </HStack>
        </ModalBody>
        <ModalHeader>
          <Button isLoading={discoverLoading}  w='100%' onClick={post}>Allocate</Button>
        </ModalHeader>
      </ModalContent>
    </Modal>
  );
};
