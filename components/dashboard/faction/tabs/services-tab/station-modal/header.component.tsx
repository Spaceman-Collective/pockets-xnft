import { STATION_USE_COST_PER_LEVEL } from "@/constants"
import { Flex, VStack, Text, Image } from "@chakra-ui/react"

export const StationModalHeader = ({
	image,
	name,
	desc,
	level,
	stationId,
}: {
	image: string
	name?: string
	desc?: string
	level?: number
	stationId?: string
}) => {
	const stationCost =
		(STATION_USE_COST_PER_LEVEL * BigInt(level ?? 0)) / BigInt(1e5)
	return (
		<Flex gap="1rem">
			<Image src={image} alt="station" w="15rem" borderRadius="1rem" />

			<VStack alignItems="start">
				<Text
					fontSize="3rem"
					fontWeight="700"
					textTransform="uppercase"
					letterSpacing="1px"
				>
					{name}
				</Text>
				<Text letterSpacing="0.5px" noOfLines={4} textOverflow="ellipsis">
					{desc}
				</Text>
				<Text>
					ID: <strong>{stationId}</strong>
				</Text>
				<Text>
					Station Level: <strong>{level}</strong>
				</Text>
				<Text>
					Station cost to use:{" "}
					<strong>{(stationCost / BigInt(1000)).toString()}K BONK</strong>
				</Text>
			</VStack>
		</Flex>
	)
}
