import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Flex, Button, Text, Box, Input } from "@chakra-ui/react";
import {
  CharacterListContainer,
} from "@/components/Containers.styled";
import { Character } from "@/types/server";
import { Frame } from "../wizard/wizard.components";
import styled from "@emotion/styled";

import { colors } from "@/styles/defaultTheme";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";

export const CharacterList: FC<{ data?: Character[] }> = ({ data }) => {
  const router = useRouter();
  const [actionStatus, setActionStatus] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter();

  const handleCharacterSelect = (char: Character) => {
    if (selectedCharacter?.mint === char.mint) {
      setSelectedCharacter(undefined);
    } else {
      setSelectedCharacter(char);
    }
  }

  return (
    <CharacterListContainer>
      <Button
        variant="solid"
        width="100%"
        onClick={() => router.push("/wizard")}
      >
        Character +
      </Button>
      <Flex direction='column' gap='1rem' my='1rem'>
          {data?.map(char => {
            return (
              <CharacterFlex key={char.mint} onClick={() => handleCharacterSelect(char)} selected={char.mint === selectedCharacter?.mint}>
                <Flex gap='1rem' alignItems='end'>
                  <Frame img={char.image} size='8rem' />
                  <Flex direction='column'>
                    <Text fontSize='2.25rem' letterSpacing='1px'>
                      {char.name.split(' ')[0]}
                    </Text>
                    <Text fontSize='1.75rem' fontWeight={700} letterSpacing='1px' textTransform='uppercase'>
                      {char.name.split(' ')[1]}
                    </Text>
                  </Flex>
                </Flex>
                {/* <Box h='5rem' w='5rem' bg='black' borderRadius='1rem' backgroundImage='' backgroundSize='cover' backgroundPosition='center' /> */}
              </CharacterFlex>
            )
          })}
        </Flex>
      {/* <Button
        variant="outline"
        width="100%"
        alignSelf='center'
        disabled={!actionStatus}
        onClick={() => { }}
      >
        Confirm
      </Button> */}
    </CharacterListContainer>
  );
};

const CharacterFlex = styled(Flex)<{ selected?: boolean }>`
  flex: auto 1 auto;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: ${(props) => {
    return props.selected ? colors.brand.tertiary : colors.blacks[500]
  }};

  :hover {
    background-color: ${colors.brand.tertiary};
  }
`;
