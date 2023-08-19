import { RESOURCE_FIELD_CREATION_MULTIPLIER } from "@/constants";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  HStack,
} from "@chakra-ui/react";
import { FC } from "react";

export const ModalRfDiscover: FC<{
  isOpen: boolean;
  onClose: () => void;
  rf?: { rfCount: number };
}> = ({ isOpen, onClose, rf }) => {
  console.log({ rf });
  const rfCount = typeof rf?.rfCount === "number" ? rf?.rfCount + 1 : 0;
  const bonkForNextField =
    (BigInt(rfCount) * RESOURCE_FIELD_CREATION_MULTIPLIER) / BigInt(1e5);

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
            <Text> {bonkForNextField.toString()}</Text>
          </HStack>
          <Button>Allocate</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
