import { FC } from "react"
import { Flex, Text } from "@chakra-ui/react"

interface MessageType {
  message: string
  subMessage: string
}

const messages: Record<string, MessageType> = {
  NoCharacterSelected: {
    message: "AW SHUCKS ANON,",
    subMessage: "SELECT A DARN CHARACTER, WILL YA?",
  },
  // ... add more types as needed
}

interface EmptyStateProps {
  type?: keyof typeof messages
}

export const EmptyState: FC<EmptyStateProps> = ({
  type = "NoCharacterSelected",
}) => {
  const { message, subMessage } = messages[type]

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
        {message}
        <br /> {subMessage}
      </Text>
    </Flex>
  )
}
