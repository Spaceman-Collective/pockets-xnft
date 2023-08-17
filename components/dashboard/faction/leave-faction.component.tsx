import {
  Box,
  Flex,
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
import { colors } from "@/styles/defaultTheme";
import { useLeaveFaction } from "@/hooks/useLeaveFaction";
import { useSolana } from "@/hooks/useSolana";

export const LeaveFactionModal = () => {
  const {
    connection,
    walletAddress,
    signTransaction,
    buildMemoIx,
    encodeTransaction,
  } = useSolana();
  const { mutate } = useLeaveFaction();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSuccess = (data: any) => {
    onClose;
  };

  const handleLeaveFaction = async () => {
    const payload = {
      mint: "CppHyx5oQ5vGGTEDk3ii5LtdzmAbdAffrqqip7AWWkdZ",
      timestamp: Date.now().toString(),
      name,
    };

    const encodedSignedTx = await encodeTransaction({
      walletAddress,
      connection,
      signTransaction,
      txInstructions: [buildMemoIx({ walletAddress, payload })],
    });

    if (!encodedSignedTx) throw Error("No Tx");
    mutate({ signedTx: encodedSignedTx }, { onSuccess });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
    >
      <Button
        bg="transparent"
        border="2px solid"
        borderColor={colors.brand.secondary}
        borderRadius="0.5rem"
        w="20rem"
        p="1rem"
        fontSize="1.75rem"
        fontWeight={600}
        letterSpacing="1px"
        onClick={onOpen}
        cursor="pointer"
        _hover={{
          bg: colors.blacks[400],
        }}
      >
        Leave
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent
          bg={colors.brand.primary}
          maxW="75rem"
          m="auto"
          p={10}
          display="flex"
          justifyContent="center"
          flexDirection="column"
          borderRadius="1rem"
        >
          <ModalHeader
            fontSize="3rem"
            fontWeight="bold"
            letterSpacing="1px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb="2rem"
          >
            <Text textAlign="center">ARE YOU SURE YOU WANT TO LEAVE?</Text>
          </ModalHeader>
          <ModalFooter
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap="4rem"
          >
            <Button
              w="100%"
              bg="transparent"
              border="2px solid"
              borderColor={colors.brand.secondary}
              borderRadius="0.5rem"
              onClick={onClose}
              _hover={{
                bg: colors.blacks[400],
              }}
            >
              CANCEL
            </Button>
            <Button
              w="100%"
              bg={colors.red[700]}
              border="2px solid"
              borderColor={colors.red[700]}
              borderRadius="0.5rem"
              onClick={handleLeaveFaction}
              _hover={{
                bg: "#ff4444",
                borderColor: "#ff4444",
              }}
            >
              LEAVE FACTION
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
