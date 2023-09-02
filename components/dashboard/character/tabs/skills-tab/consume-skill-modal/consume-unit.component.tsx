import { Tip } from "@/components/tooltip"
import { getLocalImage } from "@/lib/utils"
import { NFT, Unit, UnitTemplate, XP_PER_RANK } from "@/types/server"
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react"
import { FC } from "react"

interface UnitPlusRank extends Unit {
	rank: string
}

export const ConsumeUnitContainer: FC<{
	unit: UnitTemplate
	unitsInWallet?: UnitPlusRank[]
}> = ({ unit, unitsInWallet }) => {
	const img = getLocalImage({ type: "units", name: unit.name })
	console.log({ unitsInWallet })
	return (
		<Box>
			<Image
				src={img}
				alt={"unit " + unit.name}
				w="20rem"
				m="1rem auto"
				borderRadius="1rem"
			/>
			<Flex gap="1rem" flexWrap="wrap">
				{unitsInWallet &&
					unitsInWallet.map((unit) => {
						return <UnitFrame key={unit?.mint} unit={unit} img={img} />
					})}
			</Flex>
		</Box>
	)
}

const UnitFrame: FC<{
	unit: UnitPlusRank
	img: string
}> = ({ unit, img }) => {
	if (!unit) return null
	const bonuses = Object.keys(unit.bonus)
	return (
		<Box bg="blacks.700" color="white" p="0.5rem" borderRadius="1rem">
			<Flex
				bg="blacks.500"
				p="1rem"
				borderRadius="0.5rem 0.5rem 0 0"
				justifyContent="center"
			>
				<Text fontWeight="700" letterSpacing="1px">
					{+unit.rank * XP_PER_RANK}xp
				</Text>
			</Flex>
			<Tip
				label={
					<Box>
						{bonuses.map((bonus, i) => (
							<Flex
								key={i + "bonus" + bonus}
								justifyContent="space-between"
								gap="1rem"
								px="1rem"
							>
								<Text
									fontSize="1.25rem"
									letterSpacing="0.5px"
									w="8ch"
									noOfLines={1}
									textOverflow="ellipsis"
								>
									{bonus}
								</Text>
								<Text fontSize="1.25rem" letterSpacing="0.5px">
									{unit.bonus[bonus]}
								</Text>
							</Flex>
						))}
					</Box>
				}
			>
				<Image
					src={img}
					alt={unit.name}
					borderRadius="0 0 0.5rem 0.5rem"
					boxSize="12rem"
					h="7rem"
					objectFit="cover"
					objectPosition="top"
				/>
			</Tip>
		</Box>
	)
}
