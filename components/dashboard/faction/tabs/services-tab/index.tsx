import { Character } from "@/types/server"
import { Label, PanelContainer, Value } from "../tab.styles"
import {
	Box,
	Flex,
	Grid,
	HStack,
	Spinner,
	Text,
	VStack,
	useDisclosure,
} from "@chakra-ui/react"
import { ModalStation } from "@/components/dashboard/faction/tabs/services-tab/station-modal"
import { FC, useContext, useState } from "react"
import { useFaction } from "@/hooks/useFaction"
import { StationBox, Title } from "./service-tab.styles"
import { RemainingSlot } from "./remaining-slot.component"
import { getLocalImage } from "@/lib/utils"
import { BuildingInfoModal } from "./buildingInfo-modal"
import { MainContext } from "@/contexts/MainContext"

const stationSize = "7rem"

export const FactionTabServices: React.FC<{
	openCitizenModal: () => void
}> = ({ openCitizenModal }) => {
	const stationDisclosure = useDisclosure()
	const buildingInfoDisclosure = useDisclosure()
	const { selectedCharacter: currentCharacter } = useContext(MainContext)

	const [selectedStationId, setSelectedStationId] = useState<string>("")
	const { data: factionData } = useFaction({
		factionId: currentCharacter?.faction?.id ?? "",
	})

	const availableSlots = factionData?.faction?.townhallLevel
	const remainingSlots =
		availableSlots && availableSlots - factionData?.stations.length
	const hasRemainingSlots = remainingSlots && remainingSlots > 0

	if (!currentCharacter) {
		return (
			<HStack spacing={4} justify="center" align="center" height="100vh">
				<Spinner />
				<Text>Loading...</Text>
			</HStack>
		)
	}

	return (
		<>
			<ModalStation
				station={factionData?.stations?.find(
					(station) => station.id === selectedStationId,
				)}
				isOpen={stationDisclosure.isOpen}
				onClose={() => {
					stationDisclosure.onClose()
					setSelectedStationId("")
				}}
			/>
			<BuildingInfoModal {...buildingInfoDisclosure} />
			<PanelContainer display="flex" flexDirection="column">
				<HeaderStats
					factionName={currentCharacter.faction?.name}
					factionImage={currentCharacter?.faction?.image}
					description={currentCharacter?.faction?.description}
					factionLevel={factionData?.faction?.townhallLevel}
					population={factionData?.citizens?.length}
					onOpen={openCitizenModal}
				/>
				<Grid
					bg="blacks.700"
					p="1.5rem"
					gap="1rem"
					borderRadius="0 1rem 1rem 1rem"
					templateColumns={`repeat(auto-fill, minmax(${stationSize}, 1fr))`}
					templateRows={stationSize}
				>
					{factionData?.stations?.map((station) => (
						<Station
							key={station.id}
							station={station}
							onClick={() => {
								setSelectedStationId(station.id)
								stationDisclosure.onOpen()
							}}
						/>
					))}

					{hasRemainingSlots
						? Array.from({ length: remainingSlots }).map((_, i) => {
								const hasConstruction = i === 0 && factionData?.faction?.construction
								return (
									<RemainingSlot
										key={"slot" + i}
										factionId={factionData?.faction?.id}
										onClick={buildingInfoDisclosure.onOpen}
										construction={
											hasConstruction ? factionData.faction.construction : undefined
										}
										slots={[remainingSlots, availableSlots]}
									/>
								)
						  })
						: ""}
					{factionData?.faction?.construction?.stationId === "Townhall" && (
						<RemainingSlot
							factionId={factionData?.faction?.id}
							onClick={buildingInfoDisclosure.onOpen}
							construction={factionData.faction.construction}
							slots={[0, factionData?.faction?.townhallLevel ?? 1]}
						/>
					)}
				</Grid>
			</PanelContainer>
		</>
	)
}

const HeaderStats: React.FC<{
	onOpen: () => void
	factionName: string | undefined
	factionImage: string | undefined
	description: string | undefined
	factionLevel: number | undefined
	population: number | undefined
}> = ({
	onOpen,
	factionName,
	factionImage,
	description,
	factionLevel,
	population,
}) => {
	return (
		<Flex mt="2rem" w="100%">
			<TownHall image={factionImage ?? ""} />
			<Flex
				direction="column"
				justifyContent="space-between"
				alignItems="start"
				w="100%"
				p="1rem 1.5rem"
				flexGrow={1}
			>
				<VStack alignItems="start">
					<Title>{factionName}</Title>
					<Text noOfLines={3} textOverflow="ellipsis">
						{description}
					</Text>
				</VStack>
				<HStack alignSelf="end" justifySelf="end" gap="2rem">
					<Flex alignItems="center" gap="0.5rem">
						<Label>Level</Label>
						<Value>{factionLevel}</Value>
					</Flex>
					<Flex alignItems="center" gap="0.5rem" onClick={onOpen} cursor="pointer">
						<Label>Population</Label>
						<Value>{population}</Value>
					</Flex>
				</HStack>
			</Flex>
		</Flex>
	)
}

const TownHall: FC<{ image: string }> = ({ image }) => {
	const size = 17
	return (
		<Box
			bg="blacks.700"
			h={size + "rem"}
			w={size + 6 + "rem"} // adjust for padding removed from bottom
			p="1.5rem 1.5rem 0"
			justifySelf="start"
			borderRadius="1rem 1rem 0 0"
			alignSelf="end"
		>
			<Station
				image={image}
				onClick={() => {
					console.info("townhall coming soon")
				}}
			/>
		</Box>
	)
}

const Station: FC<{
	image?: string
	station?: { blueprint: string; faction: string; id: string; level: number }
	onClick: () => void
}> = ({ image, station, onClick }) => {
	return (
		<StationBox
			cursor="pointer"
			onClick={onClick}
			backgroundImage={
				image ??
				getLocalImage({
					type: "stations",
					name: station?.blueprint ?? "",
				})
			}
		/>
	)
}
