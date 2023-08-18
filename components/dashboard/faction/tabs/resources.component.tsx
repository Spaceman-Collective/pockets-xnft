import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  Box,
  Flex,
  Grid,
  HStack,
  Input,
  Text,
  VStack,
  Image,
  Skeleton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { Label, PanelContainer, Value } from "./tab.styles";
import styled from "@emotion/styled";
import { colors } from "@/styles/defaultTheme";
import { FC, Dispatch, SetStateAction, useState, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Character } from "@/types/server";
import { useFaction } from "@/hooks/useFaction";
import { getLocalImage } from "@/lib/utils";
import { TIP } from "@/components/tooltip/constants";
import { Tip } from "@/components/tooltip";
import { useAllocateResourceField } from "@/hooks/useAllocateResourceField";
import { useSolana } from "@/hooks/useSolana";
import { usePocketsProgram } from "@/hooks/usePocketsProgram";
import { RESOURCE_FIELDS, RESOURCES, Resource, ResourceField } from "@/types/server/Resources";
import { getResourceField, prospectResourceField } from "@/lib/solanaClient";
import { useHarvestResourceField } from "@/hooks/useHarvestResourceField";
import { useFetchAllResourceFields } from "@/hooks/useFetchAllResourceFields";
import { HarvestResouceFieldResponse } from "@/lib/apiClient";
import { RESOURCE_FIELD_CREATION_MULTIPLIER, SPL_TOKENS } from "@/constants";
import { Connection, PublicKey } from "@solana/web3.js";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";

const dummyPDA = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" //bonk token!

const spacing = "1rem";
export const FactionTabResources: React.FC<{
  currentCharacter: Character;
  setFactionStatus: (value: boolean) => void;
}> = ({ currentCharacter }) => {
  // NOTE: use this to handle local search through teasury items
  // when the api is available
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 400);
  const fetchProgram = usePocketsProgram();
  const onSearch = (e: any) => setSearch(e.target.value);
  const { data: factionData, isLoading: factionIsLoading } = useFaction({
    factionId: currentCharacter?.faction?.id ?? "",
  });
  const { mutate } = useAllocateResourceField();
  const { mutate: mutateHarvest } = useHarvestResourceField();

  const {
    connection,
    walletAddress,
    signTransaction,
    buildMemoIx,
    buildTransferIx,
    encodeTransaction,
    getBonkBalance
  } = useSolana();
  const {
    isOpen: isStatusOpen,
    onOpen: onStatusOpen,
    onClose: onStatusClose,
  } = useDisclosure();
  const {
    isOpen: isProspectOpen,
    onOpen: onProspectOpen,
    onClose: onProspectClose,
  } = useDisclosure();

  const [numProspectTransactions, setNumProspectTransactions] = useState<number>(1);
  const [discoverBtnLabel, setdiscoverBtnLabel] = useState<string>("prospect");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHarvestLoading, setIsHarvestLoading] = useState<boolean>(false);

  const [discoveredRFPDA, setDiscoveredRFPDA] = useState<string>(dummyPDA);
  const [resourceFieldList, setResourceFieldList] = useState<ResourceField[]>([]);
  const [discoveredResrouce, setDiscoveredResource] = useState<Resource>();

  const { data: currentResourceFields } = useFetchAllResourceFields();

  useEffect(() => {
    setResourceFieldList(currentResourceFields);
  }, [currentResourceFields])

  const handleDiscoverResource = async () => {
    if (!walletAddress || !connection) {
      console.log("No wallet or connection");
      return;
    };

    if (discoverBtnLabel === "discover") {
      try {
        setIsLoading(true);
        const payload = {};

        const requiredBONK =
          RESOURCE_FIELD_CREATION_MULTIPLIER *
          BigInt(currentResourceFields.length ?? 0);
        const bonkInWallet = await getBonkBalance({walletAddress, connection});

        console.log("bonkInWallet: ", bonkInWallet);
        if (bonkInWallet < requiredBONK) {
          throw alert(
            "You have insufficient BONK in your wallet. Please add more BONK and try again!"
          );
        }

        const ix = await buildTransferIx({
          walletAddress,
          mint: SPL_TOKENS.bonk.mint,
          amount: requiredBONK,
          decimals: SPL_TOKENS.bonk.decimals,
        });

        const encodedSignedTx = await encodeTransaction({
          walletAddress,
          connection,
          signTransaction,
          txInstructions: [buildMemoIx({ walletAddress, payload }), ix],
        });

        if (!encodedSignedTx) throw Error("No Tx");
        mutate(
          { signedTx: encodedSignedTx },
          {
            onSuccess: async (data: String) => {
              console.log("[handleDiscoverResource] success");

              // let program = await fetchProgram;
              // let RFAcc = program?.account.resourceField.fetchNullable(data as string);
              // let resourceName = rfAcc.harvest!.resource!.name;
              // let type = 'Legendary';

              let resourceDiscovered =
                RESOURCES[Math.floor(Math.random() % RESOURCES.length)];
              setDiscoveredResource(resourceDiscovered);

              setdiscoverBtnLabel("prospect");
              setDiscoveredRFPDA(data as string);
              onStatusOpen();
            },
            onError: () => {
              console.log("[handleDiscoverResource] error");
              setDiscoveredResource(undefined);
              onStatusOpen();
            },
          }
        );
      } catch (error) {
        console.log("[handleDiscoverResource] error");
        setIsLoading(false);
      }

      setIsLoading(false);
    } else if (discoverBtnLabel === "prospect") {
      // Handle the prospecting
      onProspectOpen();
    }
  };

  const handleHarvest = async (rf: ResourceField) => {
    console.log("harvesting ...");

    try {
      setIsHarvestLoading(true);

      const payload = {};
      const encodedSignedTx = await encodeTransaction({
        walletAddress,
        connection,
        signTransaction,
        txInstructions: [buildMemoIx({ walletAddress, payload })],
      });
      if (!encodedSignedTx) throw Error("No Tx");

      mutateHarvest(
        { signedTx: encodedSignedTx },
        {
          onSuccess: (response: HarvestResouceFieldResponse) => {
            console.log("[mutateHarvest] success", response);

            /* TODO: Update RF with the response or fetched data from db or blockchain ?! */

            const newAmount: number = Number(rf.amount) - 1;
            if (newAmount === 0) {
              /* Remove element from the resourceFieldList */
              let index = resourceFieldList.findIndex((r) => r.id === rf.id);
              let temp = [...resourceFieldList];
              temp.splice(index, 1);
              setResourceFieldList(temp);

              setdiscoverBtnLabel("discover");
            } else {
              let index = resourceFieldList.findIndex((r) => r.id === rf.id);
              let temp = [...resourceFieldList];
              temp[index] = { ...rf, amount: newAmount.toString() };
              setResourceFieldList(temp);
            }
          },
          onError: () => {
            console.log("[mutateHarvest] error");
          },
        }
      );
    } catch (error) {
      console.log("[handleHarvest] error");
    } finally {
      setIsHarvestLoading(false);
      console.log("done harvesting ...");
    }
  };

  return (
    <PanelContainer display="flex" flexDirection="column" gap="4rem">
      <Header factionName={currentCharacter?.faction?.name} />
      <VStack gap={spacing}>
        <ResourceLabels
          isLoading={isLoading}
          label={discoverBtnLabel}
          handleClick={handleDiscoverResource}
        />

        {resourceFieldList.map((rf, i) => (
          <ResourceAction key={"res" + i}>
            <Text>#{i + 1}</Text>
            <HStack>
              <Label>next harvest in:</Label>
              <Value>
                10<span style={{ fontSize: "1rem" }}>s</span>
              </Value>
            </HStack>
            <HStack>
              <Label>amount:</Label>
              <Value>{rf.amount}</Value>
            </HStack>
            <HarvestButton
              isLoading={isHarvestLoading}
              onClick={() => handleHarvest(rf)}
            >
              Harvest
            </HarvestButton>
          </ResourceAction>
        ))}
      </VStack>
      <Box>
        <Flex justifyContent="space-between" alignItems="end" mb="1rem">
          <MenuTitle mb="1rem">Treasury</MenuTitle>
          <Input
            bg="blacks.500"
            outline="none"
            placeholder="Search Items"
            p="0.5rem 2rem"
            borderRadius="1rem"
            opacity="0.5"
            onChange={onSearch}
          />
        </Flex>
        <Grid templateColumns="repeat(4,1fr)" gap={spacing}>
          {factionIsLoading &&
            Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={"resouce" + i + "load"}
                w="100%"
                h="7rem"
                borderRadius="1rem"
              />
            ))}
          {factionData?.resources
            ?.filter((resource) => {
              if (debouncedSearch === undefined || debouncedSearch === "")
                return true;
              const flatName = resource.name.replace(" ", "").toLowerCase();
              const search = debouncedSearch.toLowerCase();
              const isWithinSearchParams = flatName.includes(search);
              return isWithinSearchParams;
            })
            ?.map((resource) => (
              <ResourceItem key={resource.name} resource={resource} />
            ))}
        </Grid>
      </Box>
      <ResourcesStatusModal
        isOpen={isStatusOpen}
        onClose={onStatusClose}
        discoveredResource={discoveredResrouce}
      />
      <ProspectModal
        isOpen={isProspectOpen}
        onClose={onProspectClose}
        programPromise={fetchProgram}
        setNumProspectTxs={setNumProspectTransactions}
        numProspectTxs={numProspectTransactions}
        rfPDA={discoveredRFPDA}
        wallet={walletAddress}
        connection={connection}
        resourceFieldList={resourceFieldList}
        setResourceFieldList={setResourceFieldList}
      />
    </PanelContainer>
  );
};

const Header: React.FC<{ factionName: string | undefined }> = ({
  factionName,
}) => {
  return (
    <Flex justifyContent="space-between" alignItems="end">
      <Title verticalAlign="end">{factionName!}</Title>
      <HStack alignItems="end">
        <Label>RF Harvest Cost:</Label>
        <Value>10k BONK</Value>
      </HStack>
      <HStack alignItems="end">
        <Label>Tax Rate</Label>
        <Value>10%</Value>
      </HStack>
    </Flex>
  );
};

interface ResourceStatusModalProps {
  isOpen: boolean;
  onOpen?: () => void;
  onClose: () => void;
  discoveredResource?: Resource;
}

const ResourcesStatusModal: React.FC<ResourceStatusModalProps> = ({
  isOpen,
  onClose,
  discoveredResource
}: ResourceStatusModalProps) => {
  return (
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
          {!!discoveredResource ? (
            <Text>Discovered Resource Field</Text>
          ) : (
            <Text>Failed to discover Resource Field</Text>
          )}
        </ModalHeader>
        <ModalCloseButton position="absolute" top="30px" right="30px" />
        <ModalBody
          flex="1"
          fontSize="18px"
          fontWeight="bold"
          letterSpacing="2px"
        >
          <Flex w="100%" h="300">
            {!!discoveredResource ? (
              <Flex
                w="100%"
                h="100%"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                gap={'2rem'}
              >
                <Text>
                  With {discoveredResource.tier} Resource:{" "}
                </Text>
                <Flex
                  bg="blacks.500"
                  minH="5rem"
                  alignItems="center"
                  justifyContent="space-between"
                  p="1rem"
                  borderRadius="1rem"
                  transition="all 0.25s ease-in-out"
                  _hover={{
                    filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.25))",
                    transform: "scale(1.05)",
                  }}
                  position="relative"
                  w='50%'
                >
                  <Image
                    alt={discoveredResource.name}
                    src={getLocalImage({
                      type: "resources",
                      name: discoveredResource.name,
                    })}
                    fallbackSrc="https://via.placeholder.com/150"
                    borderRadius="0.5rem"
                    w="7rem"
                  />
                  <Value pr="1rem">{discoveredResource.name}</Value>
                </Flex>
              </Flex>
            ) : (
              <Text>Nothing to see here, move along!</Text>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface ProspectModalProps {
  isOpen: boolean;
  onOpen?: () => void;
  onClose: () => void;
  programPromise: any;
  setNumProspectTxs: (num: number) => void;
  numProspectTxs: number;
  rfPDA?: string;
  setResourceFieldList: Dispatch<SetStateAction<ResourceField[]>>;
  resourceFieldList: ResourceField[];
  wallet?: string;
  connection?: Connection;
}

const ProspectModal: React.FC<ProspectModalProps> = ({
  isOpen,
  onClose,
  setNumProspectTxs,
  numProspectTxs,
  programPromise,
  rfPDA,
  setResourceFieldList,
  resourceFieldList,
  wallet,
  connection
}: ProspectModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedChar, _] = useSelectedCharacter();

  const handleProspect = async () => {
    if (!programPromise || !wallet || !connection) return;

    try {
      setLoading(true);
      // console.log(
      //   "prospecting with wallet: ",
      //   wallet,
      //   " selectedChar: ",
      //   selectedChar,
      //   " rfPDA: ",
      //   rfPDA,
      //   " connection: ",
      //   connection,
      //   " numProspectTxs: ",
      //   numProspectTxs,
      //   " programPromise: ",
      //   programPromise,
      //   " resourceFieldList: ",
      //   resourceFieldList,
      //   " setResourceFieldList: ",
      //   setResourceFieldList
      // );

      for (let i = 0; i < numProspectTxs; i++) {
        await prospectResourceField(
          connection,
          new PublicKey(wallet),
          new PublicKey(selectedChar?.mint ?? ""),
          selectedChar?.faction?.id ?? "",
          new PublicKey(rfPDA ?? "")
        );

        // let rfAcc = { initalClaimant: wallet }
        let rfAcc = await getResourceField(connection, "");
        if (rfAcc?.initalClaimant?.toString() === wallet) {
          // Jackpot
          // TODO: This is test code, remove it
          // TODO: What ResourceField should I add to the list?

          let temp = [...resourceFieldList];
          let i = Math.floor(Math.random() * 3);
          temp.push(RESOURCE_FIELDS[i]);
          setResourceFieldList(temp);

          break;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
          Prospect
        </ModalHeader>
        <ModalCloseButton position="absolute" top="30px" right="30px" />
        <ModalBody flex="1">
          <Flex
            h="250px"
            justifyContent="space-around"
            alignItems={"center"}
            flexDirection="column"
          >
            <Text>Select how many prospect Txs you want to issue</Text>
            <HStack gap="2rem">
              <Button
                w="40px"
                onClick={() => {
                  if (numProspectTxs > 1) {
                    setNumProspectTxs(numProspectTxs - 1);
                  }
                }}
              >
                -
              </Button>
              <Text>{numProspectTxs}</Text>
              <Button
                w="40px"
                onClick={() => {
                  setNumProspectTxs(numProspectTxs + 1);
                }}
              >
                +
              </Button>
            </HStack>
          </Flex>
        </ModalBody>
        <ModalFooter
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap="4rem"
        >
          <Button
            w="100%"
            isLoading={loading}
            bg={colors.red[700]}
            border="2px solid"
            borderColor={colors.red[700]}
            borderRadius="0.5rem"
            onClick={handleProspect}
            _hover={{
              bg: "#ff4444",
              borderColor: "#ff4444",
            }}
          >
            Prospect
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface ResourceLabelsProps {
  isLoading: boolean;
  handleClick: () => void;
  label: string;
}

const ResourceLabels: React.FC<ResourceLabelsProps> = ({
  isLoading,
  handleClick,
  label,
}: ResourceLabelsProps) => {
  return (
    <Flex justifyContent="space-between" alignItems="end" mb={spacing} w="100%">
      <Tip label={TIP.RESOURCE_FIELDS} placement="top">
        <MenuTitle>resource fields</MenuTitle>
      </Tip>
      <HStack gap="4rem" alignItems="end">
        <RFButton
          isLoading={isLoading}
          color="brand.tertiary"
          onClick={handleClick}
        >
          {label}
        </RFButton>
      </HStack>
    </Flex>
  );
};

const ResourceItem: FC<{ resource: { name: string } }> = ({ resource }) => {
  const hoverProps = useDisclosure();
  return (
    <Flex
      title={resource?.name}
      key={resource?.name + "resource"}
      bg="blacks.500"
      minH="5rem"
      alignItems="center"
      justifyContent="space-between"
      p="1rem"
      borderRadius="1rem"
      transition="all 0.25s ease-in-out"
      _hover={{
        filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.25))",
        transform: "scale(1.05)",
      }}
      onMouseOver={hoverProps.onOpen}
      onMouseOut={hoverProps.onClose}
      position="relative"
    >
      <Image
        alt={resource.name}
        src={getLocalImage({
          type: "resources",
          name: resource.name,
        })}
        fallbackSrc="https://via.placeholder.com/150"
        borderRadius="0.5rem"
        w="7rem"
      />
      <Value pr="1rem">{29}</Value>
      {hoverProps.isOpen && (
        <Flex
          position="absolute"
          bg="blacks.700"
          top="-14rem"
          left="-50%"
          gap="1rem"
          alignItems="center"
          borderRadius="1rem"
        >
          <Image
            alt={resource?.name}
            src={getLocalImage({
              type: "resources",
              name: resource?.name,
            })}
            fallbackSrc="https://via.placeholder.com/150"
            borderRadius="0.5rem"
            h="13rem"
          />
          <Text fontWeight={700} w="fit-content" mr="2rem">
            {resource?.name}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

const Title = styled(Text)`
  text-transform: uppercase;
  font-size: 3rem;
  font-weight: 700;
`;

const MenuTitle = styled(Text)`
  font-size: 1.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: underline;
  padding: 1rem;
`;

const MenuText = styled(Text)`
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const RFButton = styled(Button)`
  :hover {
    background-color: ${colors.brand.tertiary};
    color: ${colors.brand.primary};
  }
`;

const HarvestButton = styled(Button)`
  background-color: transparent;

  :hover {
    background-color: transparent;
    color: ${colors.purple[700]};
  }
`;

const ResourceAction = styled(Flex)`
  background-color: ${colors.blacks[500]};
  width: 100%;
  padding: 1.5rem;
  border-radius: ${spacing};
  align-items: center;
  justify-content: space-between;
`;
