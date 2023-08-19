import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FC } from "react";

export const ModalRfDiscover: FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="blacks.500"
        p="2rem"
        borderRadius="1rem"
        minW={{ base: "90vw", md: "70vw" }}
        minH={{ base: "90vh", md: "50vh" }}
      >
        <ModalCloseButton display={{ base: "inline", md: "none" }} />
        <ModalBody>hjk</ModalBody>
      </ModalContent>
    </Modal>
  );
};
