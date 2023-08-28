import { FC } from "react"
import { Flex, Text } from "@chakra-ui/react"
import { PanelContainer } from "@/components/layout"

export const ArenaTab: FC = () => {
  return (
    <PanelContainer display="flex" flexDirection="column" gap="2rem">
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
        <Text fontSize="2rem" fontWeight="400" letterSpacing="1px">
          COMING SOON
        </Text>
      </Flex>
    </PanelContainer>
  )
}
