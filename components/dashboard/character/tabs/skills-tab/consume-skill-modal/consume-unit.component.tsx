import { getLocalImage } from "@/lib/utils"
import { NFT, Unit, UnitTemplate } from "@/types/server"
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react"
import { FC } from "react"

interface UnitPlusRank extends Unit {
	rank: string
}

export const ConsumeUnitContainer: FC<{
	unit: UnitTemplate
	unitsInWallet?: Unit[]
}> = ({ unit, unitsInWallet }) => {
	const img = getLocalImage({ type: "units", name: unit.name })
	console.log({ unitsInWallet })
	return (
		<Box>
			<Grid templateColumns="1fr 1fr">
				<Image src={img} alt={"unit " + unit.name} />
				<Flex gap="1rem" flexWrap="wrap">
					{unitsInWallet &&
						unitsInWallet.map((unit) => {
							return <UnitFrame key={unit?.mint} unit={unit} />
						})}
				</Flex>
			</Grid>
		</Box>
	)
}

const UnitFrame: FC<{
	unit: Unit
}> = ({ unit }) => {
	if (!unit) return null
	const bonuses = Object.keys(unit.bonus)
	console.log({ unit })
	return (
		<Box bg="darkblue" color="white">
			{bonuses.map((bonus, i) => (
				<Text key={i + "bonus" + bonus}>
					{bonus} {unit.bonus[bonus]}
				</Text>
			))}
		</Box>
	)
}
