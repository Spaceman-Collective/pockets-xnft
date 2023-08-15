import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import { FC } from "react";

export const FactionModal: FC<{ isOpen: boolean; onClose: () => void }> = ({
  onClose,
  isOpen,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="1rem" minW="700px" minH="400px" color="black">
        <ModalBody>test</ModalBody>
      </ModalContent>
    </Modal>
  );
};
