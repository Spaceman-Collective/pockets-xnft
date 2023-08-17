import { FC, useState } from "react";
import { useRouter } from "next/router";
import { Flex, Button, Text, Box } from "@chakra-ui/react";
import {
  CharacterListContainer,
} from "@/components/Containers.styled";
import { Character } from "@/types/server";
import { Frame } from "../wizard/wizard.components";

export const CharacterList: FC<{ data?: Character[] }> = ({ data }) => {
  const router = useRouter();
  const [actionStatus, setActionStatus] = useState(false);


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
              <Flex key={char.mint} flex='auto 1 auto' justifyContent='space-between' p='1rem' bg='blacks.500' borderRadius='1rem'>
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
                <Box h='5rem' w='5rem' bg='black' borderRadius='1rem' backgroundImage='' backgroundSize='cover' backgroundPosition='center' />
              </Flex>
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
