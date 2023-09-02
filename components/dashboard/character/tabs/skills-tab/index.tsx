import { IconSkill } from "@/components/icons"
import { colors } from "@/styles/defaultTheme"
import { Character } from "@/types/server"
import {
	Box,
	Button,
	Fade,
	Flex,
	Grid,
	HStack,
	Img,
	ListItem,
	Text,
	UnorderedList,
} from "@chakra-ui/react"
import styled from "@emotion/styled"
import Link from "next/link"
import { FC, ReactNode } from "react"
import { PageTabsEmptyState as EmptyState } from "@/components/nav"
import { PanelContainer } from "@/components/layout"
import { combatSkillKeys } from "./constants"
import { Tip } from "../../../../tooltip"

export const SkillsTab: React.FC<{
	currentCharacter: Character
	selectSkill: (skill: string) => void
}> = ({ currentCharacter, selectSkill }) => {
	const experienceKeys = Object.keys(currentCharacter.experience) as Array<
		keyof typeof currentCharacter.experience
	>

	return (
		<PanelContainer display="flex" flexDirection="column" gap="3rem">
			<Header
				name={currentCharacter.name}
				image={currentCharacter.image}
				faction={currentCharacter.faction?.name}
			/>
			<Fade in={!!currentCharacter?.experience}>
				<Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="1rem">
					<SkillContainer>
						{currentCharacter.experience &&
							experienceKeys
								?.filter((key) => !combatSkillKeys.includes(key.toLowerCase()))
								?.sort((a, b) => a.localeCompare(b))
								.map((key) => (
									<>
										<SkillBox
											key={"noncombat" + key}
											onClick={selectSkill}
											name={key}
											level={currentCharacter.skills[key].toString()}
											xp={
												currentCharacter.experience[key].current.toString() +
												"/" +
												currentCharacter.experience[key].threshold.toString()
											}
										/>
									</>
								))}
					</SkillContainer>
					<SkillContainer isCombat>
						{experienceKeys
							?.filter((key) => combatSkillKeys.includes(key.toLowerCase()))
							?.sort((a, b) => a.localeCompare(b))
							.map((key) => {
								if (!currentCharacter) return
								if (currentCharacter?.experience[key]?.current === undefined) return
								if (currentCharacter?.experience[key]?.current === null) return

								return (
									<SkillBox
										key={"combat" + key}
										onClick={selectSkill}
										name={key}
										level={currentCharacter.skills[key].toString()}
										xp={
											currentCharacter.experience[key].current.toString() +
											"/" +
											currentCharacter.experience[key].threshold.toString()
										}
									/>
								)
							})}
					</SkillContainer>
				</Grid>
				<br></br>
				<Flex m="1 auto" fontSize="1.5rem" gap="2rem" fontWeight="600">
					<Box flex="1" background="blacks.500" p="2rem" borderRadius="0.5rem">
						<Text fontWeight="600">Confused on what to do next? Try:</Text>
						<UnorderedList pl="0.5rem" mt="1rem" fontWeight="500">
							<ListItem>Join a Faction</ListItem>
							<ListItem>Harvest resources</ListItem>
							<ListItem>Train your skills</ListItem>
							<ListItem>Build your army</ListItem>
							<ListItem>Go to battle!</ListItem>
						</UnorderedList>
					</Box>
					<Box flex="2" background="blacks.500" p="2rem" borderRadius="0.5rem">
						<Text>
							Training your skills and racking up battle wins helps you boost your
							faction&apos;s chances at victory in one of the three win conditions!
						</Text>
						<UnorderedList pl="0.5rem" mt="1rem" fontWeight="500">
							<ListItem>
								<strong>Domination:</strong> collectively won battles by faction
							</ListItem>
							<ListItem>
								<strong>Knowledge:</strong> total skill levels of faction citizens
							</ListItem>
							<ListItem>
								<strong>Wealth:</strong> total resources burned by your faction
							</ListItem>
						</UnorderedList>
					</Box>
				</Flex>
			</Fade>
			{/* <Flex gap="4rem"> */}
			{/*   <Value>ARMY</Value> */}
			{/*   <HStack> */}
			{/*     <Label>Equipped</Label> */}
			{/*     <Value>123/456</Value> */}
			{/*   </HStack> */}
			{/* </Flex> */}
			{/* <Grid templateColumns="repeat(auto-fill,minmax(100px,1fr))"> */}
			{/*   <TroopBox num={1} /> */}
			{/*   <TroopBox num={2} /> */}
			{/*   <TroopBox num={3} /> */}
			{/*   <TroopBox /> */}
			{/* </Grid> */}
		</PanelContainer>
	)
}

const Header: FC<{ image: string; name: string; faction: any }> = ({
	image,
	name,
	faction,
}) => {
	return (
		<Flex gap="1.5rem" alignItems="center">
			<Box
				bgImage={image}
				w="7rem"
				h="7rem"
				bgSize="cover"
				borderRadius="0.5rem"
			/>
			<Flex flexDir="column">
				<Text
					fontFamily="header"
					fontSize="3rem"
					lineHeight="3rem"
					mb="0.5rem"
					fontWeight={700}
				>
					{name}
				</Text>
				<Flex alignItems="center" fontSize="1.5rem" lineHeight="1.5rem">
					<Text fontWeight="700" pr="0.5rem">
						FACTION:
					</Text>
					{faction ? (
						<Text
							fontWeight="600"
							backgroundColor="blacks.600"
							borderRadius="0.5rem"
							h="3rem"
							p="0 1rem"
							display="flex"
							justifyContent="center"
							alignItems="center"
						>
							{faction}
						</Text>
					) : (
						<Link href="/faction">
							<Button fontSize="1rem">Join Faction</Button>
						</Link>
					)}
				</Flex>
			</Flex>
		</Flex>
	)
}

const TroopBox = ({ num = 4 }: { num?: number }) => {
	const size = "90px"
	return (
		<Flex
			direction="column"
			justifyContent="space-between"
			h={size}
			w={size}
			bg="brand.primary"
			p="0.5rem 0.5rem"
			borderRadius="0.5rem"
			backgroundImage={`mock/troop-${num}.png`}
			backgroundSize="110%"
			backgroundPosition="center"
			filter="drop-shadow(0 5px 0 rgba(0,0,0,0.0)) saturate(0.7)"
			transition="all 0.25s ease-in-out"
			_hover={{
				filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.9)) saturate(1.5)",
				transform: "scale(1.05)",
			}}
		>
			<Flex justifyContent="space-between">
				<Badge>10</Badge>
				<Badge>-</Badge>
			</Flex>

			<Flex justifyContent="space-between">
				<Badge>10</Badge>
				<Badge>+</Badge>
			</Flex>
		</Flex>
	)
}

const Badge = ({ children }: { children: ReactNode }) => {
	return (
		<Grid
			bg="black"
			placeItems="center"
			w="3rem"
			h="3rem"
			borderRadius="3px"
			opacity=".5"
			transition="all 0.25s ease-in-out"
			_hover={{
				opacity: "1",
			}}
		>
			<Text fontWeight={700} letterSpacing="1px" w="fit-content">
				{children}
			</Text>
		</Grid>
	)
}

const SkillContainer: FC<{ children: ReactNode; isCombat?: boolean }> = ({
	children,
	isCombat,
}) => {
	return (
		<Box>
			<Value mb="1rem">{!isCombat && "NON-"}Combat Skills</Value>
			<Grid templateColumns="1fr 1fr" gap="1rem">
				{children}
			</Grid>
		</Box>
	)
}

const SkillBox: FC<{
	name: string
	level: string
	xp: string
	onClick: (skill: string) => void
}> = ({ name, level, xp, onClick }) => {
	const click = () => onClick(name.toLowerCase())
	const Icon = () => {
		function is(value: string) {
			return name.toLowerCase() === value.toLowerCase()
		}
		const style = {
			color: colors.brand.quaternary,
			fontSize: "3rem",
		}

		return is("athletics") ? (
			<IconSkill.athletics {...style} />
		) : is("electronics") ? (
			<IconSkill.electronics {...style} />
		) : is("farming") ? (
			<IconSkill.farming {...style} />
		) : is("fighting") ? (
			<IconSkill.fighting {...style} />
		) : is("forestry") ? (
			<IconSkill.forestry {...style} />
		) : is("healing") ? (
			<IconSkill.healing {...style} />
		) : is("manufacturing") ? (
			<IconSkill.manufacturing {...style} />
		) : is("mining") ? (
			<IconSkill.mining {...style} />
		) : is("psionics") ? (
			<IconSkill.psionics {...style} />
		) : is("shooting") ? (
			<IconSkill.shooting {...style} />
		) : is("magic") ? (
			<IconSkill.magic {...style} />
		) : is("strength") ? (
			<IconSkill.strength {...style} />
		) : (
			<div />
		)
	}

	return (
		<Flex
			bg="blacks.500"
			h="7rem"
			alignItems="center"
			gap="0.5rem"
			borderRadius="0.5rem"
			title={name}
			opacity={level === "0" ? "0.25" : "1"}
			_hover={{
				opacity: 1,
			}}
			transition="all 0.25s ease-in-out"
			cursor="pointer"
			onClick={click}
		>
			<Grid
				bg="blacks.700"
				h="5rem"
				w="5rem"
				ml="1rem"
				borderRadius="0.65rem"
				title={name}
				placeItems="center"
			>
				<Icon />
			</Grid>
			<Flex direction="column">
				<HStack>
					<Label>LVL:</Label>
					<Value>{level}</Value>
				</HStack>
				<HStack>
					<Label>XP:</Label>
					<Value>{xp}</Value>
				</HStack>
			</Flex>
		</Flex>
	)
}

const Frame = ({
	img,
	select,
	size = "50px",
}: {
	img: string
	select?: () => void
	size?: string
}) => {
	if (!img) return ""
	return (
		<Box cursor={!!select ? "pointer" : "initial"} position="relative">
			<Img width="50" height="50" borderRadius="1rem" alt="nft" src={img} />
		</Box>
	)
}

const Label = styled(Text)`
	text-transform: uppercase;
	letter-spacing: 1px;
	opacity: 0.5;
	font-weight: 700;
	font-size: 1.25rem;
`

const Value = styled(Text)`
	font-weight: 700;
	font-size: 1.5rem;
	text-transform: uppercase;
`
