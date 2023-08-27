import styled from "@emotion/styled";
import {
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { FaFilter } from "react-icons/fa";
import { useAllFactions } from "@/hooks/useAllFactions";
import { LeaderboardItem } from "./faction-leaderboard-bar.component";

export const LeaderboardList = () => {
  const handleFilter = (e: any) => console.info(e);
  const { data } = useAllFactions();

  return (
    <LeaderboardContainer>
      <Flex justifyContent="space-between">
        <Title>LEADERBOARD</Title>
        <Flex
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
          w="100%"
          m="0rem 2rem 1rem 5rem"
        >
          <Text
            w="16rem"
            h="100%"
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            Favors
          </Text>
          <Text
            w="16rem"
            h="100%"
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            Dom Wins
          </Text>
          <Text
            w="16rem"
            h="100%"
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            Wealth
          </Text>
          <Text
            w="16rem"
            h="100%"
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            Knowledge
          </Text>
        </Flex>

        <Menu>
          <MenuButton
            bg="transparent"
            _hover={{
              bg: "transparent",
              color: colors.brand.tertiary,
            }}
            as={Button}
            leftIcon={<Icon as={FaFilter} />}
          >
            SORT
          </MenuButton>
          <MenuList bg={colors.blacks[700]} border="none">
            <MenuItem
              bg={colors.blacks[700]}
              _hover={{ bg: colors.blacks[500] }}
              onClick={() => handleFilter("favor")}
            >
              Favor
            </MenuItem>
            <MenuItem
              bg={colors.blacks[700]}
              _hover={{ bg: colors.blacks[500] }}
              onClick={() => handleFilter("domWins")}
            >
              Dom Wins
            </MenuItem>
            <MenuItem
              bg={colors.blacks[700]}
              _hover={{ bg: colors.blacks[500] }}
              onClick={() => handleFilter("wealth")}
            >
              Wealth
            </MenuItem>
            <MenuItem
              bg={colors.blacks[700]}
              _hover={{ bg: colors.blacks[500] }}
              onClick={() => handleFilter("knowledge")}
            >
              Knowledge
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <VStack align="start" spacing={5} overflowY="auto" h="100%" w="100%">
        {data?.factions?.map((faction) => (
          <LeaderboardItem
            key={faction.id}
            rank={faction.townhallLevel}
            name={faction.name}
            imageUrl={faction.image}
            stats={{
              knowledge: 2,
              domWins: 2,
              favor: 2,
              wealth: 2,
            }}
          />
        ))}
      </VStack>
    </LeaderboardContainer>
  );
};

export const LeaderboardContainer = styled(Box)`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 3rem;
  width: 100%;
  height: 72rem;
  border-radius: 0.5rem;
  background-color: ${colors.brand.primary};
`;

const LeaderTitle = styled(Text)`
  text-transform: uppercase;
  font-size: 2rem;
  font-weight: 800;
  font-spacing: 3px;
  width: 100%;
`;

const Title = styled(Text)`
  text-transform: uppercase;
  font-size: 3rem;
  font-weight: 800;
  font-spacing: 3px;
  margin-bottom: 3px;
`;
