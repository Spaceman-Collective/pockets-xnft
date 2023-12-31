import { Text, Box, Image, Grid } from "@chakra-ui/react"
import { FC } from "react"
import styled from "@emotion/styled"
import { getLocalImage } from "@/lib/utils"
import { Tip } from "@/components/tooltip"

export const ResourceContainer: FC<{
	isDisabled?: boolean
	resources?: { name: string; balance: string; amount: string | number }[]
	type: "resources" | "units"
	rareDrop?: any
	stationLevel?: number
}> = ({ resources, isDisabled, type, rareDrop, stationLevel }) => {
	return (
		<Grid
			borderRadius="1rem"
			bg="brand.quaternary"
			minH="33rem"
			minW="33rem"
			placeItems="center"
			p="4rem"
			opacity={isDisabled ? 0.5 : 1}
		>
			<Grid
				templateColumns={resources && resources?.length > 1 ? "1fr 1fr" : "1fr"}
				gap="1rem"
			>
				{resources?.map((resource) => (
					<Box
						key={resource.name}
						userSelect="none"
						opacity={
							type === "units" || +resource.amount < +resource.balance ? 1 : 0.25
						}
					>
						<Tip
							label={"You own " + resource?.balance + " " + resource.name}
							placement="top"
						>
							<Text fontWeight={700} color="brand.secondary">
								{resource?.balance}x
							</Text>
						</Tip>
						<Tip
							label={
								(type === "resources" ? "Requires " : "Creates ") +
								resource.amount +
								" " +
								resource.name
							}
						>
							<Box
								position="relative"
								transition="all 0.25s ease-in-out"
								_hover={{ transform: "scale(1.1)" }}
							>
								<Resource
									alt="resource"
									src={getLocalImage({ type, name: resource.name })}
								/>

								<Text
									position="absolute"
									bottom="0"
									right="0"
									bg="rgba(0,0,0,0.5)"
									p="0.25rem 0.5rem"
									borderRadius="1rem"
									fontWeight={700}
									minW="3rem"
									textAlign="center"
								>
									{resource.amount}
								</Text>
							</Box>
						</Tip>
					</Box>
				))}

				{rareDrop && stationLevel && (
					<Box bg="green.700" p="2rem" borderRadius="1rem">
						{stationLevel <= 1 && (
							<Text>
								Upgrade station to have a chance of additionally dropping {rareDrop}
							</Text>
						)}
						{stationLevel > 1 && (
							<Text color="brand.secondary">
								Has a {15 * (stationLevel - 1)}% chance of dropping{" "}
								<strong>{rareDrop}</strong>
							</Text>
						)}
					</Box>
				)}
			</Grid>
		</Grid>
	)
}

const Resource = styled(Image)`
	border-radius: 1rem;
`
