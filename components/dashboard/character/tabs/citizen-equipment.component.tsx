import { colors } from "@/styles/defaultTheme"
import { Character } from "@/types/server"
import {
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Image,
	Text,
} from "@chakra-ui/react"
import React, { FC } from "react"
import { combatSkillKeys } from "../constants"

export const CitizenEquipment: FC<{
	enabled: boolean
	opponent?: boolean
	citizen: Character
}> = ({ enabled, citizen, opponent }) => {
	const combatLevel = combatSkillKeys.reduce(
		(acc, key) =>
			acc + citizen.skills[key.charAt(0).toUpperCase() + key.slice(1)] || 0,
		0,
	)

	const hasUnits = citizen.army.length

	return (
		<Flex
			w="100%"
			bgColor="blacks.500"
			borderRadius="0.5rem"
			p="1.75rem"
			_notLast={{ marginBottom: "2rem" }}
			pos="relative"
		>
			{hasUnits || !opponent ? null : (
				<Text
					fontSize="2rem"
					fontWeight="700"
					position="absolute"
					width="100%"
					height="calc(100% - 2rem)"
					textAlign="center"
					display="flex"
					alignItems="center"
					justifyContent="center"
					zIndex={100}
					color="brand.secondary"
				>
					NO UNITS EQUIPPED
				</Text>
			)}
			<Flex w="100%" opacity={hasUnits || !opponent ? 1 : 0.25}>
				<Flex
					flex="0 0 auto"
					bgColor="brand.tertiary"
					borderRadius="0.5rem"
					w="12rem"
					h="12rem"
					p="1rem"
					bgImage={citizen.image}
					bgSize="cover"
					bgPos="center"
				>
					<Box
						backgroundColor="brand.quaternary"
						width="2.75rem"
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
							color="blacks.500"
						>
							{combatLevel}
						</Text>
					</Box>
				</Flex>
				<Flex p="0 1.75rem" flexDirection="column" w="100%" flex="1 1 auto">
					<Text
						w="100%"
						paddingBottom="1.75rem"
						fontSize="2rem"
						lineHeight="2rem"
						fontWeight="700"
						color="brand.secondary"
						textTransform="uppercase"
					>
						{citizen.name}
					</Text>
					<Grid templateColumns="repeat(8, 0fr)" gap="1rem">
						{Array.from({ length: 16 }, (_, i) => (
							<GridItem
								key={i}
								bgColor="blacks.400"
								h="3.5rem"
								w="3.5rem"
								borderRadius="0.25rem"
							/>
						))}
					</Grid>
				</Flex>
				{opponent ? (
					<Flex
						flexDirection="column"
						flex="0 0 auto"
						justifyContent="space-between"
						alignItems="flex-end"
					>
						<Flex
							flexDirection="row"
							alignItems="center"
							justifyContent="space-between"
							cursor="pointer"
							opacity="0.75"
							transition="0.1s ease"
							_hover={{
								opacity: 1,
							}}
						>
							<Text
								textTransform="uppercase"
								fontSize="1.25rem"
								fontWeight="600"
								color="brand.secondary"
								paddingRight="1.5rem"
								textAlign="right"
							>
								Battle <br />
								History
							</Text>
							<Image
								src={"/assets/arena/helmet.svg"}
								w="4rem"
								h="4rem"
								alt="helmet"
								color="blue"
								transform="scaleX(-1)" // Flip around the Y axis
							/>
						</Flex>

						<Button
							variant={enabled ? "solid" : "transparent"}
							border={
								enabled
									? `0.25rem solid ${colors.blacks[700]}`
									: "0.25rem solid #ffffff"
							}
							_hover={{
								border: enabled
									? `0.25rem solid ${colors.blacks[600]}`
									: "0.25rem solid #ffffff",
								bgColor: enabled ? colors.blacks[600] : "",
							}}
							width="100%"
							p="1rem 3.5rem"
							fontSize="1.5rem"
							color={enabled ? "" : "#ffffff"}
							disabled={!enabled}
						>
							{enabled ? "Battle" : "04:52:31"}
						</Button>
					</Flex>
				) : null}
			</Flex>
		</Flex>
	)
}
