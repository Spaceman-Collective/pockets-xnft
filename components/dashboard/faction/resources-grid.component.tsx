import styled from "@emotion/styled";
import {
  Box,
  Image,
  Flex,
  Text,
  Input,
  Grid,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { getLocalImage } from "@/lib/utils";
import { useDebounce } from "@uidotdev/usehooks";
import { useAllWalletAssets } from "@/hooks/useWalletAssets";
import { ModalSendResource } from "./tabs/resources-tab/send-modal.component";

export const ResourceGridContainer: FC<{
  isLoading: boolean;
  resources?: { name: string; value: string }[];
  factionPubKey?: string;
  factionName?: string;
}> = ({ isLoading, resources, factionPubKey, factionName }) => {
  const { data } = useAllWalletAssets();
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 400);
  const onSearch = (e: any) => setSearch(e.target.value);

  const sendDisclosure = useDisclosure();
  const [selectedResource, setSelectedResource] = useState<string>(""); // for displaying resource modal
  const valueInWallet =
    data?.resources.find(
      (e) => e.name.toLowerCase() === selectedResource.toLowerCase(),
    )?.value ?? 0;

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="end" mb="1rem">
        <MenuTitle mb="1rem">{factionPubKey && "Faction "}Treasury</MenuTitle>
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
      <Grid templateColumns="repeat(4,1fr)" gap="1rem">
        {isLoading &&
          Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={"resouce" + i + "load"}
              w="100%"
              h="7rem"
              borderRadius="1rem"
            />
          ))}
        {resources
          ?.filter((resource) => {
            if (debouncedSearch === undefined || debouncedSearch === "")
              return true;
            const flatName = resource.name.replace(" ", "").toLowerCase();
            const search = debouncedSearch.toLowerCase();
            const isWithinSearchParams = flatName.includes(search);
            return isWithinSearchParams;
          })
          ?.map((resource) => (
            <ResourceItem
              key={resource.name}
              resource={resource}
              openModal={() => {
                if (!factionPubKey) return;
                setSelectedResource(resource.name);
                sendDisclosure.onOpen();
              }}
            />
          ))}
      </Grid>
      <ModalSendResource
        {...sendDisclosure}
        selectedResource={selectedResource}
        valueInWallet={+valueInWallet}
        factionPubKey={factionPubKey}
        factionName={factionName}
      />
    </Box>
  );
};

const ResourceItem: FC<{
  openModal: () => void;
  resource: { name: string; value: string };
}> = ({ resource, openModal }) => {
  const hoverProps = useDisclosure();
  return (
    <Flex
      key={resource?.name + "resource"}
      cursor="pointer"
      bg="blacks.500"
      minH="5rem"
      alignItems="center"
      justifyContent="space-between"
      p="1rem"
      borderRadius="1rem"
      transition="all 0.25s ease-in-out"
      opacity={resource?.value === "0" ? 0.25 : 1}
      _hover={{
        filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.25))",
        transform: "scale(1.05)",
        opacity: 1,
      }}
      onMouseOver={hoverProps.onOpen}
      onMouseOut={hoverProps.onClose}
      onClick={openModal}
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
      <Text pr="1rem">{resource?.value ?? 0}</Text>
      {hoverProps.isOpen && (
        <Flex
          position="absolute"
          bg="blacks.700"
          top="-18rem"
          gap="1rem"
          alignItems="center"
          borderRadius="1rem"
          direction="column"
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
          <Text fontWeight={700} w="fit-content" m="1rem">
            {resource?.name}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

const MenuTitle = styled(Text)`
  font-size: 1.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: underline;
`;
