import styled from "@emotion/styled"
import { Grid, Image, Flex, Text, Box } from "@chakra-ui/react"
import { colors } from "@/styles/defaultTheme"
import { FC } from "react"

export const LeaderboardItem: FC<{
	name: string
	imageUrl: string
	rank: number // town hall level
	stats: {
		domWins: number
		wealth: number
		knowledge: number
	}
}> = ({ name, imageUrl, rank, stats }) => {
	return (
		<Grid
			bg={colors.blacks[600]}
			w="100%"
			p="2rem 3rem"
			borderRadius="1rem"
			templateColumns={{ base: "1fr", sm: "2fr 3fr" }}
		>
			<Flex alignItems="center" gap="2rem" mr="2rem">
				<Image
					src={imageUrl}
					alt={name}
					boxSize="50px"
					objectFit="cover"
					borderRadius="0.5rem"
				/>
				<LeaderTitle>{name}</LeaderTitle>
			</Flex>
			<Flex
				display={{ base: "none", sm: "flex" }}
				justifyContent="space-between"
				alignItems="center"
				fontSize="1.75rem"
				fontWeight="700"
				textTransform="uppercase"
			>
				<Text>{stats.domWins}</Text>
				<Text>{stats.wealth}</Text>
				<Text>{stats.knowledge}</Text>
			</Flex>
		</Grid>
	)
}

const LeaderTitle = styled(Text)`
	text-transform: uppercase;
	font-size: 2rem;
	font-weight: 800;
	font-spacing: 3px;
	width: 100%;
`
