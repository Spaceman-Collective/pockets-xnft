import Head from "next/head";
import { NavBar } from "@/components/nav";
import styled from "@emotion/styled";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  DashboardContainer,
  DashboardInfoContainer,
  DashboardMenuContainer,
} from "@/components/Containers.styled";
import { DashboardInfo, DashboardMenu } from "@/components/dashboard";
import { colors } from "@/styles/defaultTheme";
import { Faction } from "@/types/server/Faction";
import { Value } from "@/components/dashboard/personal/personal.styled";
import { useState } from "react";
import { FaFilter } from "react-icons/fa";

export default function Leaderboard() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleFilter = (value: string) => {
    setSelectedFilter(value);
  };

  const sortedFactions = () => {
    return [...tenMockFactions].sort((a, b) => {
      const aStats = tenMockFactionStats.find((stat) => stat.id === a.id);
      const bStats = tenMockFactionStats.find((stat) => stat.id === b.id);

      if (!aStats || !bStats) return 0;

      if (selectedFilter === "favor") {
        return bStats.favor - aStats.favor;
      }
      if (selectedFilter === "domWins") {
        return bStats.domWins - aStats.domWins;
      }
      if (selectedFilter === "knowledge") {
        return bStats.knowledge - aStats.knowledge;
      }
      if (selectedFilter === "wealth") {
        return bStats.wealth - aStats.wealth;
      }

      return 0; // Default or no filter
    });
  };

  return (
    <>
      <Head>
        <title>Pockets.gg</title>
        <meta name="description" content="Idle-RPG with your NFTs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <Grid placeItems="center" minH="50vh">
        <DashboardContainer>
          <DashboardInfoContainer>
            <DashboardInfo />
          </DashboardInfoContainer>
          <DashboardMenuContainer>
            <DashboardMenu />
          </DashboardMenuContainer>
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
            <VStack
              align="start"
              spacing={5}
              overflowY="auto"
              h="100%"
              w="100%"
            >
              {sortedFactions().map((faction, index) => {
                const stats = tenMockFactionStats.find(
                  (stat) => stat.id === faction.id,
                );
                return stats ? (
                  <FactionItem
                    key={faction.id}
                    rank={index + 1}
                    faction={faction}
                    stats={stats}
                  />
                ) : null;
              })}
            </VStack>
          </LeaderboardContainer>
        </DashboardContainer>
      </Grid>
    </>
  );
}

type FactionItemProps = {
  rank: number;
  faction: Faction;
  stats: FactionStats;
};

export const FactionItem: React.FC<FactionItemProps> = ({
  rank,
  faction,
  stats,
}) => {
  return (
    <HStack
      spacing={4}
      alignItems="center"
      w="100%"
      display="flex"
      justifyContent="space-between"
      bg={colors.blacks[600]}
      pr="2rem"
      pl="2rem"
      py="2rem"
    >
      <HStack spacing={2} alignItems="center">
        <Image
          boxSize="50px"
          objectFit="cover"
          src={faction.image}
          alt={faction.name}
          borderRadius="0.5rem"
          mr="2rem"
        />
        <LeaderTitle>
          {rank}. {faction.name}
        </LeaderTitle>
      </HStack>
      <Flex justifyContent="flex-end" mr="10rem">
        <Flex w="5rem" h="100%" justifyContent="flex-end" alignItems="center">
          <Value>{stats.favor}</Value>
        </Flex>
        <Flex w="16rem" h="100%" justifyContent="flex-end" alignItems="center">
          <Value>{stats.domWins}</Value>
        </Flex>
        <Flex w="16rem" h="100%" justifyContent="flex-end" alignItems="center">
          <Value>{stats.wealth}</Value>
        </Flex>
        <Flex w="16rem" h="100%" justifyContent="flex-end" alignItems="center">
          <Value>{stats.knowledge}</Value>
        </Flex>
      </Flex>
    </HStack>
  );
};

export type FactionStats = {
  name: string;
  id: string;
  favor: number;
  domWins: number;
  wealth: number;
  knowledge: number;
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

export const tenMockFactions: Faction[] = [
  {
    id: "f1",
    pubkey: "pubkey1",
    creator: "creator1",
    name: "Dragon Clan",
    image: "/assets/factions/dragonclan.png",
    external_link: "https://dragonclan.org",
    description:
      "A clan known for their fierce warriors and fire-breathing dragons.",
    townhallLevel: 3,
    lastLooted: "2023-07-20T10:00:00Z",
    construction: {
      finishedAt: "2023-08-01T10:00:00Z",
      stationId: "station1",
      blueprint: "dragon-lair",
      stationNewLevel: 2,
    },
    taxRate: 5,
  },
  {
    id: "f2",
    pubkey: "pubkey2",
    creator: "creator2",
    name: "Elf Kingdom",
    image: "/assets/factions/elfkingdom.png",
    external_link: "https://elfkingdom.org",
    description: "Masters of the forest and skilled in the magical arts.",
    townhallLevel: 4,
    lastLooted: "2023-06-15T12:00:00Z",
    construction: {
      finishedAt: undefined,
      stationId: "station2",
      blueprint: "elf-tree-house",
      stationNewLevel: 1,
    },
    taxRate: 4,
  },
  {
    id: "f3",
    pubkey: "pubkey3",
    creator: "creator3",
    name: "Mystic Wizards",
    image: "/assets/factions/mysticwizards.png",
    external_link: "https://mysticwizards.org",
    description: "Ancient wizards wielding arcane magics.",
    townhallLevel: 5,
    lastLooted: "2023-06-10T14:00:00Z",
    construction: {
      finishedAt: "2023-07-15T16:00:00Z",
      stationId: "station3",
      blueprint: "wizard-tower",
      stationNewLevel: 2,
    },
    taxRate: 6,
  },
  {
    id: "f4",
    pubkey: "pubkey4",
    creator: "creator4",
    name: "Orc Tribes",
    image: "/assets/factions/orctribes.png",
    external_link: "https://orctribes.org",
    description: "Brutal orc warriors from the harsh terrains.",
    townhallLevel: 2,
    lastLooted: "2023-06-05T18:00:00Z",
    construction: {
      finishedAt: "2023-06-30T19:00:00Z",
      stationId: "station4",
      blueprint: "orc-hut",
      stationNewLevel: 1,
    },
    taxRate: 8,
  },
  {
    id: "f5",
    pubkey: "pubkey5",
    creator: "creator5",
    name: "Dwarf Engineers",
    image: "/assets/factions/dwarfengineers.png",
    external_link: "https://dwarfengineers.org",
    description: "Craftsmen and miners, building intricate machines.",
    townhallLevel: 3,
    lastLooted: "2023-05-29T10:00:00Z",
    construction: {
      finishedAt: undefined,
      stationId: "station5",
      blueprint: "dwarf-forge",
      stationNewLevel: 1,
    },
    taxRate: 5,
  },
  {
    id: "f6",
    pubkey: "pubkey6",
    creator: "creator6",
    name: "Undead Horde",
    image: "/assets/factions/undeadhorde.png",
    external_link: "https://undeadhorde.org",
    description: "The risen dead, seeking to claim the living.",
    townhallLevel: 2,
    lastLooted: "2023-05-20T11:00:00Z",
    construction: {
      finishedAt: "2023-06-10T10:00:00Z",
      stationId: "station6",
      blueprint: "undead-mausoleum",
      stationNewLevel: 3,
    },
    taxRate: 10,
  },
  {
    id: "f7",
    pubkey: "pubkey7",
    creator: "creator7",
    name: "Beast Tamers",
    image: "/assets/factions/beasttamers.png",
    external_link: "https://beasttamers.org",
    description:
      "Masters of animals, from the wild forests to the vast plains.",
    townhallLevel: 3,
    lastLooted: "2023-05-15T12:00:00Z",
    construction: {
      finishedAt: "2023-05-30T14:00:00Z",
      stationId: "station7",
      blueprint: "tamer-hut",
      stationNewLevel: 1,
    },
    taxRate: 7,
  },
  {
    id: "f8",
    pubkey: "pubkey8",
    creator: "creator8",
    name: "Sea Raiders",
    image: "/assets/factions/searaiders.png",
    external_link: "https://searaiders.org",
    description: "Pirates of the sea, seeking treasure and adventure.",
    townhallLevel: 1,
    lastLooted: "2023-05-10T08:00:00Z",
    construction: {
      finishedAt: "2023-05-25T09:00:00Z",
      stationId: "station8",
      blueprint: "raider-ship",
      stationNewLevel: 2,
    },
    taxRate: 9,
  },
  {
    id: "f9",
    pubkey: "pubkey9",
    creator: "creator9",
    name: "Celestial Beings",
    image: "/assets/factions/celestialbeings.png",
    external_link: "https://celestialbeings.org",
    description: "God-like beings watching over the realms.",
    townhallLevel: 5,
    lastLooted: "2023-05-05T06:00:00Z",
    construction: {
      finishedAt: undefined,
      stationId: "station9",
      blueprint: "celestial-temple",
      stationNewLevel: 3,
    },
    taxRate: 3,
  },
  {
    id: "f10",
    pubkey: "pubkey10",
    creator: "creator10",
    name: "Knight Order",
    image: "/assets/factions/knightorder.png",
    external_link: "https://knightorder.org",
    description: "Honorable knights who value chivalry and order.",
    townhallLevel: 5,
    lastLooted: "2023-08-05T08:00:00Z",
    construction: {
      finishedAt: "2023-08-10T08:00:00Z",
      stationId: "station10",
      blueprint: "knight-castle",
      stationNewLevel: 3,
    },
    taxRate: 6,
  },
];

export const tenMockFactionStats: FactionStats[] = [
  {
    id: "f1",
    name: "Dragon Clan",
    favor: 75,
    domWins: 15,
    wealth: 10000,
    knowledge: 150,
  },
  {
    id: "f2",
    name: "Elf Kingdom",
    favor: 90,
    domWins: 10,
    wealth: 12000,
    knowledge: 180,
  },
  {
    id: "f3",
    name: "Mystic Wizards",
    favor: 85,
    domWins: 18,
    wealth: 14000,
    knowledge: 200,
  },
  {
    id: "f4",
    name: "Orc Tribes",
    favor: 65,
    domWins: 12,
    wealth: 8000,
    knowledge: 110,
  },
  {
    id: "f5",
    name: "Dwarf Engineers",
    favor: 78,
    domWins: 14,
    wealth: 9000,
    knowledge: 140,
  },
  {
    id: "f6",
    name: "Undead Horde",
    favor: 60,
    domWins: 9,
    wealth: 7500,
    knowledge: 90,
  },
  {
    id: "f7",
    name: "Beast Tamers",
    favor: 80,
    domWins: 16,
    wealth: 9500,
    knowledge: 160,
  },
  {
    id: "f8",
    name: "Sea Raiders",
    favor: 70,
    domWins: 11,
    wealth: 8500,
    knowledge: 120,
  },
  {
    id: "f9",
    name: "Celestial Beings",
    favor: 95,
    domWins: 20,
    wealth: 13000,
    knowledge: 210,
  },
  {
    id: "f10",
    name: "Knight Order",
    favor: 88,
    domWins: 17,
    wealth: 11000,
    knowledge: 170,
  },
];
