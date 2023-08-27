import styled from "@emotion/styled";
import { HStack, Image, Flex, Text } from "@chakra-ui/react";
import { Value } from "@/components/dashboard/personal/personal.styled";
import { colors } from "@/styles/defaultTheme";
import { FC } from "react";
import { Faction } from "@/types/server";

export const LeaderboardItem: FC<{
  name: string;
  imageUrl: string;
  rank: number;
  stats: {
    favor: number;
    domWins: number;
    wealth: number;
    knowledge: number;
  };
}> = ({ name, imageUrl, rank, stats }) => {
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
          src={imageUrl}
          alt={name}
          borderRadius="0.5rem"
          mr="2rem"
        />
        <LeaderTitle>
          {rank}. {name}
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

const LeaderTitle = styled(Text)`
  text-transform: uppercase;
  font-size: 2rem;
  font-weight: 800;
  font-spacing: 3px;
  width: 100%;
`;
