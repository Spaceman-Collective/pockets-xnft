import {
	Box,
	Flex,
	Grid,
	HStack,
	Text,
	useDisclosure,
	Spinner,
} from "@chakra-ui/react"
import { Label, PanelContainer, Value } from "../tab.styles"
import styled from "@emotion/styled"
import { FC, useEffect, useState } from "react"
import { Character } from "@/types/server"
import { useFaction } from "@/hooks/useFaction"
import { timeout } from "@/lib/utils"
import { TIP } from "@/components/tooltip/constants"
import { Tip } from "@/components/tooltip"
import { useResourceField } from "@/hooks/useResourceField"
import { useCharTimers } from "@/hooks/useCharTimers"
import {
	ResourceActionContainer,
	ResourceFieldAction,
} from "./resource-field-action.component"
import { useRfAllocation } from "@/hooks/useRf"
import { ModalRfDiscover } from "./discover-modal.component"
import { ModalRfProspect } from "./prospect-modal.component"
import { ResourceGridContainer } from "../../resources-grid.component"
import Confetti from "@/components/Confetti"
import { useQueryClient } from "@tanstack/react-query"

const spacing = "1rem"
export const FactionTabResources: React.FC<{
	currentCharacter: Character
	setFactionStatus: (value: boolean) => void
}> = ({ currentCharacter }) => {
	const discoverDisclosure = useDisclosure()
	const prospectDisclosure = useDisclosure()
	const queryClient = useQueryClient()

	const { data: factionData, isLoading: factionIsLoading } = useFaction({
		factionId: currentCharacter?.faction?.id ?? "",
	})

	const { data: rfData, refetch: refetchRF } = useResourceField({
		factionId: currentCharacter?.faction?.id,
	})

	const { data: timersData } = useCharTimers({
		mint: currentCharacter?.mint,
	})

	const [confetti, setConfetti] = useState(false)
	const fireConfetti = async () => {
		if (confetti) return
		setConfetti(true)
		await timeout(3600)
		setConfetti(false)
	}

	const { data: discoverData, refetch: refetchRFAllocation } = useRfAllocation()

	const [discoverableData, setDiscoverableData] = useState<any>(discoverData)
	useEffect(() => {
		queryClient.refetchQueries({ queryKey: ["fetch-resource-field"] })
	}, [discoverableData])
	useEffect(() => {
		refetchRFAllocation().then((data) => setDiscoverableData(data.data))
	}, [refetchRFAllocation])

	return (
		<PanelContainer display="flex" flexDirection="column" gap="4rem">
			<Header
				factionName={currentCharacter?.faction?.name}
				taxRate={factionData?.faction?.taxRate}
			/>
			<Box>
				<ResourceLabels
					onClick={() => {
						if (discoverableData?.isDiscoverable) {
							discoverDisclosure.onOpen()
						} else {
							prospectDisclosure.onOpen()
						}
					}}
					discoverableData={discoverableData}
				/>
				<Grid templateColumns="1fr 1fr" gap={spacing}>
					{rfData?.rfs.map((rf) => (
						<ResourceFieldAction
							key={rf.id}
							rf={rf}
							timer={timersData?.rfTimers.find((timer) => timer.rf === rf.id)}
							charMint={currentCharacter?.mint}
						/>
					))}
					{rfData?.rfs &&
						rfData?.rfs?.length < 2 &&
						Array.from({ length: 2 - rfData?.rfs.length }).map((_, i) => (
							<ResourceActionContainer key={"empty" + i} />
						))}
				</Grid>
			</Box>
			<ResourceGridContainer
				isLoading={factionIsLoading}
				resources={factionData?.resources}
				factionPubKey={factionData?.faction?.pubkey}
				factionName={factionData?.faction?.name}
			/>
			<ModalRfDiscover
				refetchRFAllocation={refetchRFAllocation}
				setDiscoverableData={setDiscoverableData}
				rf={discoverableData}
				openProspect={prospectDisclosure.onOpen}
				fire={fireConfetti}
				{...discoverDisclosure}
			/>
			<ModalRfProspect
				setDiscoverableData={setDiscoverableData}
				refetchRFAllocation={refetchRFAllocation}
				rf={discoverableData}
				charMint={currentCharacter.mint}
				factionId={currentCharacter?.faction?.id}
				currentCharacter={currentCharacter}
				{...prospectDisclosure}
				fire={fireConfetti}
			/>
			{confetti && <Confetti canFire={confetti} />}
		</PanelContainer>
	)
}

const Header: React.FC<{
	factionName: string | undefined
	taxRate: number | undefined
}> = ({ factionName, taxRate }) => {
	return (
		<Flex justifyContent="space-between" alignItems="end">
			<Title verticalAlign="end">{factionName!}</Title>
			<Tip label="Percentage that the faction takes of each harvest. Adjusted through Politics.">
				<HStack alignItems="end">
					<Label>Faction Tax Rate</Label>
					<Value>{taxRate}%</Value>
				</HStack>
			</Tip>
		</Flex>
	)
}

const ResourceLabels: FC<{ discoverableData?: any; onClick: () => void }> = ({
	discoverableData,
	onClick,
}) => {
	return (
		<Flex justifyContent="space-between" alignItems="end" mb={spacing} w="100%">
			<Tip label={TIP.RESOURCE_FIELDS} placement="top">
				<MenuTitle>resource fields</MenuTitle>
			</Tip>
			<HStack gap="4rem" alignItems="end">
				{/* <MenuText color="brand.quaternary">harvest all</MenuText> */}
				{discoverableData?.isDiscoverable === undefined && (
					<Spinner mb="0.75rem" mr="1rem" />
				)}
				{discoverableData?.isDiscoverable === true && (
					<MenuText cursor="pointer" color="brand.tertiary" onClick={onClick}>
						discover
					</MenuText>
				)}
				{discoverableData?.isDiscoverable === false && (
					<MenuText cursor="pointer" color="brand.quaternary" onClick={onClick}>
						prospect
					</MenuText>
				)}
			</HStack>
		</Flex>
	)
}

const Title = styled(Text)`
	text-transform: uppercase;
	font-size: 3rem;
	font-weight: 700;
`

const MenuTitle = styled(Text)`
	font-size: 1.75rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 1px;
	text-decoration: underline;
	padding: 1rem;
`

const MenuText = styled(Text)`
	font-size: 1.5rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 1px;
`
