import {
  Box,
  Flex,
  Grid,
  HStack,
  Input,
  Text,
  VStack,
  Image,
  Skeleton,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { Label, PanelContainer, Value } from "../tab.styles";
import styled from "@emotion/styled";
import { FC, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Character } from "@/types/server";
import { useFaction } from "@/hooks/useFaction";
import { getLocalImage } from "@/lib/utils";
import { TIP } from "@/components/tooltip/constants";
import { Tip } from "@/components/tooltip";
import { useResourceField } from "@/hooks/useResourceField";
import { useCharTimers } from "@/hooks/useCharTimers";
import {
  ResourceActionContainer,
  ResourceFieldAction,
} from "./resource-field-action.component";
import { useRfAllocation } from "@/hooks/useRf";
import { ModalRfDiscover } from "./discover-modal.component";
import { ModalRfProspect } from "./prospect-modal.component";

const spacing = "1rem";
export const FactionTabResources: React.FC<{
  currentCharacter: Character;
  setFactionStatus: (value: boolean) => void;
}> = ({ currentCharacter }) => {
  const discoverDisclosure = useDisclosure();
  const prospectDisclosure = useDisclosure();
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 400);
  const onSearch = (e: any) => setSearch(e.target.value);
  const { data: factionData, isLoading: factionIsLoading } = useFaction({
    factionId: currentCharacter?.faction?.id ?? "",
  });

  const { data: rfData } = useResourceField({
    factionId: currentCharacter?.faction?.id,
  });

  const { data: timersData } = useCharTimers({
    mint: currentCharacter?.mint,
  });

  const { data: discoverData } = useRfAllocation();

  return (
    <PanelContainer display="flex" flexDirection="column" gap="4rem">
      <Header factionName={currentCharacter?.faction?.name} />
      <Box>
        <ResourceLabels
          onClick={() => {
            if (discoverData?.isDiscoverable) {
              discoverDisclosure.onOpen();
            } else {
              prospectDisclosure.onOpen();
            }
          }}
          isDiscoverable={discoverData?.isDiscoverable}
        />
        <Grid templateColumns="1fr 1fr" gap={spacing}>
          {rfData?.rfs.map((rf) => (
            <ResourceFieldAction
              key={rf.id}
              rf={rf}
              timer={timersData?.rfTimers.find((timer) => timer.rf === rf.id)}
            />
          ))}
          {rfData?.rfs &&
            rfData?.rfs?.length < 2 &&
            Array.from({ length: 2 - rfData?.rfs.length }).map((_, i) => (
              <ResourceActionContainer key={"empty" + i} />
            ))}
        </Grid>
      </Box>
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
      <ModalRfDiscover rf={discoverData} {...discoverDisclosure} />
      <ModalRfProspect
        rf={discoverData}
        charMint={currentCharacter.mint}
        factionId={currentCharacter?.faction?.id}
        {...prospectDisclosure}
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
        <Label>RF Prospect Cost:</Label>
        <Value>10k BONK</Value>
      </HStack>
      <HStack alignItems="end">
        <Label>Tax Rate</Label>
        <Value>10%</Value>
      </HStack>
    </Flex>
  );
};

const ResourceLabels: FC<{ isDiscoverable?: boolean; onClick: () => void }> = ({
  isDiscoverable,
  onClick,
}) => {
  return (
    <Flex justifyContent="space-between" alignItems="end" mb={spacing} w="100%">
      <Tip label={TIP.RESOURCE_FIELDS} placement="top">
        <MenuTitle>resource fields</MenuTitle>
      </Tip>
      <HStack gap="4rem" alignItems="end">
        <MenuText color="brand.quaternary">harvest all</MenuText>
        {isDiscoverable === undefined && <Spinner mb="0.75rem" mr="1rem" />}
        {isDiscoverable === true && (
          <MenuText color="brand.tertiary" onClick={onClick}>
            discover
          </MenuText>
        )}
        {isDiscoverable === false && (
          <MenuText color="brand.quaternary" onClick={onClick}>
            prospect
          </MenuText>
        )}
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
`;
const MenuText = styled(Text)`
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;
