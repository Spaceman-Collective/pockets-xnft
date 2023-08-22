import { FC, useState } from "react";
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
import { colors } from "@/styles/defaultTheme";
import { useSolana } from "@/hooks/useSolana";
import { useCreateFaction } from "@/hooks/useCreateFaction";
import { SPL_TOKENS, FACTION_CREATION_MULTIPLIER } from "@/constants";
import { useAllFactions } from "@/hooks/useAllFactions";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";
import toast from "react-hot-toast";

export const CreateFaction: FC<{
  fire: () => void;
  setFactionStatus: (value: boolean) => void;
}> = ({ fire: fireConfetti, setFactionStatus }) => {
  const {
    connection,
    walletAddress,
    signTransaction,
    buildMemoIx,
    buildTransferIx,
    encodeTransaction,
    getBonkBalance,
  } = useSolana();
  const { data: currentFactions } = useAllFactions();
  const { mutate } = useCreateFaction();
  const [faction, setFaction] = useState({
    name: "",
    image: "",
    external_link: "",
    description: "",
  });
  const [inputErrors, setInputErrors] = useState({
    name: "",
    image: "",
    external_link: "",
    description: "",
  });
  const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter();

  const validateInputs = () => {
    let errors = {
      name: "",
      image: "",
      external_link: "",
      description: "",
    };

    let isValid = true;

    if (!faction.name.trim()) {
      errors.name = "Faction Name is required.";
      isValid = false;
    }

    if (!faction.image.trim()) {
      errors.image = "Image URL is required.";
      isValid = false;
    }

    if (!faction.external_link.trim()) {
      errors.external_link = "External Url is required.";
      isValid = false;
    }

    if (!faction.description.trim()) {
      errors.description = "Description is required.";
      isValid = false;
    }

    setInputErrors(errors);
    return isValid;
  };

  const { isOpen, onOpen, onClose: chakraOnClose } = useDisclosure();

  const onClose = () => {
    setFaction({
      name: "",
      image: "",
      external_link: "",
      description: "",
    });
    chakraOnClose();
  };

  const onSuccess = (data: any) => {
    setFactionStatus(true);
    fireConfetti();
    onClose();
  };

  const handleCreateFaction = async () => {
    if (!validateInputs()) {
      return;
    }
    const payload = {
      mint: selectedCharacter,
      timestamp: Date.now().toString(),
    };

    if (!walletAddress || !signTransaction || !connection) {
      throw alert("The *basics* are undefined");
    }

    const totalFactions = currentFactions?.total;
    const requiredBONK =
      FACTION_CREATION_MULTIPLIER * BigInt(totalFactions ?? 0);
    const bonkInWallet = await getBonkBalance({ walletAddress, connection });
    if (bonkInWallet < requiredBONK / BigInt(1e5)) {
      throw alert(
        `You have insufficient BONK in your wallet. Please add more BONK and try again! Required amount: ${
          requiredBONK / BigInt(1e5)
        } Current balance: ${bonkInWallet}`
      );
    }

    const memoIx = buildMemoIx({ walletAddress, payload });
    const transferIx = buildTransferIx({
      walletAddress,
      mint: SPL_TOKENS["bonk"].mint,
      amount: requiredBONK,
      decimals: SPL_TOKENS["bonk"].decimals,
    });

    const encodedSignedTx = await encodeTransaction({
      walletAddress,
      connection,
      signTransaction,
      txInstructions: [memoIx, transferIx],
    });

    if (typeof encodedSignedTx == "string") {
      mutate(
        { signedTx: encodedSignedTx as string, factionData: faction },
        { onSuccess }
      );
    } else {
      console.error("No Tx");
      return;
    }
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
        mt="1rem"
        bg={colors.brand.quaternary}
        borderRadius="0.5rem"
        p="1rem"
        width="40rem"
        fontSize="2rem"
        fontWeight={600}
        letterSpacing="1px"
        onClick={onOpen}
        cursor="pointer"
      >
        Create a Faction
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent
          bg={colors.brand.primary}
          maxW="75rem"
          minH="50rem"
          m="auto"
          p={10}
          display="flex"
          flexDirection="column"
          borderRadius="1rem"
        >
          <ModalHeader fontSize="24px" fontWeight="bold" letterSpacing="3px">
            CREATE A FACTION
          </ModalHeader>
          <ModalCloseButton position="absolute" top="30px" right="30px" />
          <ModalBody flex="1">
            <Box w="100%" h="100%">
              <Box mb="2rem">
                <Input
                  type="text"
                  placeholder="Faction Name"
                  value={faction.name}
                  onChange={(e) =>
                    setFaction({ ...faction, name: e.target.value })
                  }
                  bg={colors.blacks[600]}
                  h="5rem"
                  w="100%"
                  borderRadius="4"
                  py="1rem"
                  px="2rem"
                  isInvalid={!!inputErrors.name}
                />
                {inputErrors.name && (
                  <Text color="red.500">{inputErrors.name}</Text>
                )}
              </Box>

              <Box mb="2rem">
                <Input
                  type="text"
                  placeholder="Image URL"
                  value={faction.image}
                  onChange={(e) =>
                    setFaction({ ...faction, image: e.target.value })
                  }
                  bg={colors.blacks[600]}
                  h="5rem"
                  w="100%"
                  borderRadius="4"
                  py="1rem"
                  px="2rem"
                  isInvalid={!!inputErrors.image}
                />
                {inputErrors.image && (
                  <Text color="red.500">{inputErrors.image}</Text>
                )}
              </Box>

              <Box mb="2rem">
                <Input
                  type="text"
                  placeholder="External Url"
                  value={faction.external_link}
                  onChange={(e) =>
                    setFaction({ ...faction, external_link: e.target.value })
                  }
                  bg={colors.blacks[600]}
                  h="5rem"
                  w="100%"
                  borderRadius="4"
                  py="1rem"
                  px="2rem"
                  isInvalid={!!inputErrors.external_link}
                />
                {inputErrors.external_link && (
                  <Text color="red.500">{inputErrors.external_link}</Text>
                )}
              </Box>

              <Box mb="2rem">
                <Textarea
                  placeholder="Description"
                  value={faction.description}
                  onChange={(e) =>
                    setFaction({ ...faction, description: e.target.value })
                  }
                  bg={colors.blacks[600]}
                  h="15rem"
                  w="100%"
                  borderRadius="4"
                  py="1rem"
                  px="2rem"
                  isInvalid={!!inputErrors.description}
                />
                {inputErrors.description && (
                  <Text color="red.500">{inputErrors.description}</Text>
                )}
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              w="100%"
              bg={colors.brand.quaternary}
              onClick={handleCreateFaction}
              mb="1rem"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
