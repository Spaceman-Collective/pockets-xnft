import { useState } from "react";
import { Box, Flex, Grid, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { Label, PanelContainer, Value } from "../personal/personal.styled";
import { colors } from "@/styles/defaultTheme";
import styled from "@emotion/styled";
import { useDebounce } from "@uidotdev/usehooks";


const spacing = "1rem";

export const Personal = () => {

  // NOTE: use this to handle local search through teasury items
  // when the api is available
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 400);
  const onSearch = (e: any) => setSearch(e.target.value);
  console.log(debouncedSearch);

  return (
    <PanelContainer display="flex" flexDirection="column" gap="4rem">
      <VStack gap={spacing}>
        <ResourceLabels />
        {Array.from({ length: 3 }).map((_, i) => (
          <ResourceAction key={"res" + i}>
            <Text>#{i + 1}</Text>
            <HStack>
              <Label>reward:</Label>
              <Value>
                10<span> GOLD</span>
              </Value>
            </HStack>
            <HStack>
              <Label>cost:</Label>
              <Value>
                1000000<span> BONK</span>
              </Value>
            </HStack>
            <MenuText
              color={"brand.quaternary"}
              cursor={i > 1 ? "not-allowed" : "pointer"}
            >
              complete
            </MenuText>
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
        <Grid
          templateColumns="repeat(auto-fit, minmax(100px,1fr))"
          gap={spacing}
        >
          {Array.from({ length: 222 }).map((_, i) => (
            <Flex
              key={i}
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
            >
              <Box
                h="4rem"
                w="4rem"
                bg="brand.primary"
                borderRadius="0.5rem"
                backgroundImage={`https://picsum.photos/seed/${i * 2}/32`}
              />
              <Value pr="1rem">78</Value>
            </Flex>
          ))}
        </Grid>
      </Box>
    </PanelContainer>
  );
};

const ResourceLabels = () => {
  return (
    <Flex justifyContent="space-between" alignItems="end" mb={spacing} w="100%">
      <MenuTitle>favors</MenuTitle>
      <HStack gap="4rem" alignItems="end">
        <MenuText color="brand.tertiary">see all</MenuText>
      </HStack>
    </Flex>
  );
};

const FavorTitle = styled(Text)`
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
  font-size: 1.25rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1px;
`;
const ResourceAction = styled(Flex)`
  background-color: ${colors.blacks[500]};
  width: 100%;
  padding: 1.5rem;
  border-radius: ${spacing};
  align-items: center;
  justify-content: space-between;
`;