import React from "react"
import { Box, Flex, Text } from "@chakra-ui/react"

interface CharacterImageProps {
	image: string
	level: number
}

export const CharacterImage: React.FC<CharacterImageProps> = ({
	image,
	level,
}) => {
	return (
		<Flex
			w="12rem"
			h="12rem"
			bgImage={image}
			bgSize="cover"
			bgPos="center"
			borderRadius="0.5rem"
			p="1rem"
		>
			<Box
				backgroundColor="brand.quaternary"
				minW="2.75rem"
				p="0 0.5rem"
				height="2.75rem"
				borderRadius="0.25rem"
				justifyContent="center"
				alignItems="center"
			>
				<Text
					fontSize="1.75rem"
					fontWeight="700"
					display="block"
					textAlign="center"
					alignSelf="center"
					color="blacks.700"
				>
					{level}
				</Text>
			</Box>
		</Flex>
	)
}
