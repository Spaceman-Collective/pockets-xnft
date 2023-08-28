import { FC, useState } from "react"
import { useRouter } from "next/router"
import { Flex, Button, Text, Box, Skeleton, SlideFade } from "@chakra-ui/react"
import { CharacterListContainer } from "@/components/layout/containers.styled"
import { Character } from "@/types/server"
import { Frame } from "../wizard/wizard.components"
import styled from "@emotion/styled"

import { colors } from "@/styles/defaultTheme"
import { Tip } from "../tooltip"

interface Props {
  selectedCharacter: Character | undefined | null
  setSelectedCharacter: (char?: Character | null) => void
  data?: Character[]
  isLoading?: boolean
}

export const CharacterList: FC<Props> = ({
  selectedCharacter,
  setSelectedCharacter,
  data,
  isLoading,
}: Props) => {
  const router = useRouter()
  const [actionStatus, setActionStatus] = useState(false)

  const handleCharacterSelect = (char: Character) => {
    if (selectedCharacter?.mint === char.mint) {
      setSelectedCharacter(undefined)
    } else {
      setSelectedCharacter(char)
    }
  }

  return (
    <CharacterListContainer>
      <Button
        variant="solid"
        border="2px solid"
        borderColor={colors.blacks[700]}
        _hover={{
          borderColor: colors.blacks[700],
        }}
        width="100%"
        onClick={() => router.push("/wizard")}
      >
        Character +
      </Button>
      <Flex direction="column" gap="1rem" my="1rem">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <SlideFade
              key={"charskele" + i}
              in={isLoading}
              unmountOnExit={!isLoading}
            >
              <Skeleton h="10rem" w="100%" borderRadius="1rem" />
            </SlideFade>
          ))}
        <SlideFade in={!!data}>
          {data?.map((char) => {
            return (
              <CharacterFlex
                key={char.mint}
                onClick={() => handleCharacterSelect(char)}
                selected={char.mint === selectedCharacter?.mint}
              >
                <Flex gap="1rem" alignItems="center">
                  <Box position="relative">
                    <Frame img={char.image} size="8rem" />
                    <Tip
                      label={`Sum of ${
                        char.name.split(" ")[0]
                      }'s skills. View breakdown on Character page.`}
                      placement="right"
                    >
                      <Text
                        fontSize="1.5rem"
                        fontWeight={700}
                        position="absolute"
                        top="-0.5rem"
                        left="-0.5rem"
                        bg="brand.quaternary"
                        color="brand.primary"
                        w="fit-content"
                        p="0 1rem"
                        borderRadius="1rem"
                        filter="drop-shadow(0 2px 2px rgba(0,0,0,0.25))"
                      >
                        {Object.values(char.skills).reduce((a, b) => a + b)}
                      </Text>
                    </Tip>
                  </Box>
                  <Flex direction="column">
                    <Text fontSize="2.25rem" letterSpacing="1px">
                      {char.name.split(" ")[0]}
                    </Text>
                    <Text
                      fontSize="1.75rem"
                      fontWeight={700}
                      letterSpacing="1px"
                      textTransform="uppercase"
                    >
                      {char.name.split(" ")[1]}
                    </Text>
                  </Flex>
                </Flex>
                {char?.faction?.name && (
                  <CharFactionThumbnail
                    factionName={char?.faction?.name}
                    factionImage={char?.faction?.image}
                    charName={char?.name.split(" ")[0]}
                  />
                )}
              </CharacterFlex>
            )
          })}
        </SlideFade>
      </Flex>
    </CharacterListContainer>
  )
}

const CharacterFlex = styled(Flex)<{ selected?: boolean }>`
  flex: auto 1 auto;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 1rem;
  background-color: ${colors.blacks[500]};
  border: 2px solid
    ${(props) => {
      return props.selected ? colors.brand.secondary : colors.blacks[500]
    }};
`

const CharFactionThumbnail: FC<{
  factionName?: string
  factionImage?: string
  charName: string
}> = ({ factionName, factionImage, charName }) => {
  return (
    <>
      {factionName && (
        <Tip
          label={`${charName} in the faction:
          ${factionName}`}
          placement="top"
        >
          <FactionThumbnail backgroundImage={factionImage} />
        </Tip>
      )}
      {!factionName && (
        <Tip
          label={`${charName} is not part of a faction, but can join one!`}
          placement="top"
        >
          <FactionThumbnail />
        </Tip>
      )}
    </>
  )
}

const FactionThumbnail = styled(Box)`
  height: 4rem;
  width: 4rem;
  background-color: white;
  border-radius: 1rem;
  background-size: cover;
  background-position: center;
`
