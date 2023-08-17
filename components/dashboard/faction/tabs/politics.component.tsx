import {
  Box,
  Input,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
} from "@chakra-ui/react";
import { PanelContainer } from "./tab.styles";
import { colors } from "@/styles/defaultTheme";
import { useLeaveFaction } from "@/hooks/useLeaveFaction";
import { useSolana } from "@/hooks/useSolana";
import { LeaveFactionModal } from "../leave-faction.component";

export const FactionTabPolitics = () => {
  const {
    connection,
    walletAddress,
    signTransaction,
    buildMemoIx,
    encodeTransaction,
  } = useSolana();

  return (
    <PanelContainer
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <LeaveFactionModal/>
    </PanelContainer>
  );
};
