import { getLocalImage } from "@/lib/utils";
import {
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { FC } from "react";

export const ModalSendResource: FC<{
  isOpen: boolean;
  onClose: () => void;
  selectedResource?: string;
}> = ({ isOpen, onClose, selectedResource }) => {
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
          Send Resource
        </ModalHeader>
        <ModalCloseButton display={{ base: "inline", md: "none" }} />
        <ModalBody>
          <Text>{selectedResource}</Text>
          <Image
            alt={selectedResource}
            src={getLocalImage({
              type: "resources",
              name: selectedResource ?? "",
            })}
            fallbackSrc="https://via.placeholder.com/150"
            borderRadius="0.5rem"
            w="7rem"
          />
        </ModalBody>
        <ModalFooter>
          <Button>Send Resource</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
