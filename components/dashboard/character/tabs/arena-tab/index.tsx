import { FC } from "react"
import { Flex, Text } from "@chakra-ui/react"

export const ArenaTab: FC = () => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="2rem"
      h="100%"
    >
      <Text
        textAlign="center"
        fontSize="3rem"
        fontWeight="800"
        maxWidth="50rem"
        letterSpacing="1px"
      >
        Arena Tab
      </Text>
    </Flex>
  )
}
