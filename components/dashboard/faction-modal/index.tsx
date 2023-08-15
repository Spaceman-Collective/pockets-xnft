import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Input,
  Text,
  Flex,
  Box,
  Button,
} from "@chakra-ui/react";
import { FC } from "react";
import { GiMagnifyingGlass, GiSpyglass } from "react-icons/gi";
import styled from "@emotion/styled";
import { colors } from "@/styles/defaultTheme";
import { FactionBox } from "./faction-item.component";

export const FactionModal: FC<{ isOpen: boolean; onClose: () => void }> = ({
  onClose,
  isOpen,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        p="1rem"
        minW={{ base: "95%", sm: "600px" }}
        minH="600px"
        maxH="800px"
        bg="blacks.500"
        color="brand.secondary"
        borderRadius="1rem"
        overflow="auto"
      >
        <ModalBody>
          <Flex
            mt="1rem"
            bg="brand.primary"
            borderRadius="1rem"
            alignItems="center"
          >
            <SearchBar
              placeholder="faction"
              _focus={{
                outline: "none",
              }}
            />
            <GiMagnifyingGlass
              fontSize="3rem"
              style={{ marginRight: "2rem" }}
            />
          </Flex>
          <Flex direction="column" mt="2rem" gap="2rem">
            {Array.from({ length: 7 }).map((_, i) => (
              <FactionBox key={i + "faction"} />
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const SearchBar = styled(Input)`
  color: ${colors.brand.tertiary};
  background-color: inherit;
  border-radius: inherit;
  padding: 2rem;
  width: 100%;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 3px;

  :focus: {
    outline: none;
  }
`;