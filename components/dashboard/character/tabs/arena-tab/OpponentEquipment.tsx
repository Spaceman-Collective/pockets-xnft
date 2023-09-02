import { colors } from "@/styles/defaultTheme"
import { BattleMemo, Character } from "@/types/server"
import {
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Image,
	Text,
	useDisclosure,
} from "@chakra-ui/react"
import React, { FC, useState } from "react"
import { combatSkillKeys } from "../../constants"
import { Tip } from "@/components/tooltip"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { useBattle, useBattleHistory } from "@/hooks/useBattle"
import { useSolana } from "@/hooks/useSolana"
import toast from "react-hot-toast"
import { CharacterImage } from "./CharacterImage"
import { BattleHistoryModal } from "./BattleHistoryModal"
import { useQueryClient } from "@tanstack/react-query"

export const OpponentEquipment: FC<{
	enabled: boolean
	opponent: Character
	currentCharacter: Character
}> = ({ enabled, opponent, currentCharacter }) => {
	const totalCombatLevel = combatSkillKeys.reduce(
		(acc, key) =>
			acc + opponent.skills[key.charAt(0).toUpperCase() + key.slice(1)] || 0,
		0,
	)

	const { isOpen, onOpen, onClose } = useDisclosure()

	const unitsAreaIsScrollable = opponent.army.length > 20
	const unitArea = React.useRef<HTMLDivElement>(null)
	const [canScrollUp, setCanScrollUp] = useState<boolean>(false)
	const [canScrollDown, setCanScrollDown] = useState<boolean>(
		unitsAreaIsScrollable,
	)

	const queryClient = useQueryClient()

	const {
		buildMemoIx,
		walletAddress,
		encodeTransaction,
		connection,
		signTransaction,
	} = useSolana()

	const { mutate: battleMutate } = useBattle()
	const { data: battleHistory, isLoading: battleHistoryIsLoading } =
		useBattleHistory(currentCharacter.mint, [opponent])

	const [currentlyScrolling, setCurrentlyScrolling] = useState<boolean>(false)

	const handleScroll = (direction: "up" | "down") => {
		if (currentlyScrolling) return

		const scrollAmount = 90 // 10rem + 1.25rem (grid gap)
		const scrollDirection = direction === "up" ? -1 : 1
		const top = scrollAmount * scrollDirection + unitArea.current!.scrollTop

		setCurrentlyScrolling(true)
		unitArea.current!.scroll({ top, behavior: "smooth" })
		setTimeout(() => {
			setCurrentlyScrolling(false)
		}, 200)
	}

	const handleBattle = async () => {
		const payload: BattleMemo = {
			mint: currentCharacter.mint,
			timestamp: Date.now().toString(),
			defendingMint: opponent.mint,
		}

		const txInstructions = [
			buildMemoIx({ walletAddress: walletAddress || "", payload }),
		]

		let encodedTx
		try {
			encodedTx = await encodeTransaction({
				walletAddress,
				connection,
				signTransaction,
				txInstructions,
			})
		} catch (e) {}

		if (!encodedTx || typeof encodedTx !== "string") {
			return toast.error("no encoded tx")
		}

		battleMutate(encodedTx, {
			onSuccess: async (e) => {
				// Refetch battle history
				await queryClient.invalidateQueries([
					"battleHistory",
					currentCharacter.mint,
					[opponent],
				])
				const won = e.result.winner === currentCharacter.mint

				if (won) {
					toast.success("You won the battle!")
				} else {
					toast.error("You lost the battle!")
				}
			},
			onError: (e) => {
				toast.error(JSON.stringify(e))
			},
		})
	}

	const handleBattleHistory = async () => {
		onOpen()
	}

	const handleScrollEvent = () => {
		const { scrollTop, scrollHeight, clientHeight } = unitArea.current!
		setCanScrollUp(!(scrollTop === 0))
		setCanScrollDown(!(scrollHeight - scrollTop === clientHeight))
	}

	React.useEffect(() => {
		unitArea.current?.addEventListener("scroll", handleScrollEvent)
	}, [])

	return (
		<>
			<Grid
				templateAreas={`
					"image name name historyButton"
					"image units scroller historyButton"
					"image units scroller battleButton"
				`}
				gridTemplateRows={"0fr 1fr 3fr"}
				gridTemplateColumns={"12rem 2fr 0fr 1fr"}
				h="16rem"
				maxW="100%"
				gap="2rem"
				p="2rem"
				borderRadius="0.5rem"
				overflow="hiddden"
				bgColor="blacks.500"
				_notLast={{
					marginBottom: "2rem",
				}}
			>
				<GridItem
					area="image"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<CharacterImage image={opponent.image} level={totalCombatLevel} />
				</GridItem>
				<GridItem
					area="name"
					display="flex"
					flexDir="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Text
						fontSize="2rem"
						lineHeight="2rem"
						fontWeight="700"
						color="brand.secondary"
						textTransform="uppercase"
					>
						{opponent.name}
					</Text>
				</GridItem>
				<GridItem area="units" overflow="hidden" ref={unitArea}>
					{opponent.army.length ? (
						<Grid templateColumns="repeat(6, 0fr)" gap="1rem">
							{opponent.army.length
								? opponent.army.map((unit) => (
										<Tip
											label={`${unit.name}\n with bonus: ${Object.keys(unit.bonus).join(
												", ",
											)}`}
											placement="top"
											key={unit.assetId}
										>
											<GridItem
												bgColor="blacks.400"
												minH="3.5rem"
												w="3.5rem"
												borderRadius="0.25rem"
												bgImage={unit.image}
												bgSize="cover"
												bgPos="center"
											/>
										</Tip>
								  ))
								: null}
						</Grid>
					) : (
						<Box pos="relative" maxW="100%" overflow="hidden">
							<Text
								fontSize="2rem"
								fontWeight="700"
								position="absolute"
								h="8rem"
								w="calc(100% - 4rem)"
								textAlign="center"
								display="flex"
								alignItems="center"
								justifyContent="center"
								zIndex={100}
								color="brand.secondary"
								opacity="0.5"
							>
								NO UNITS EQUIPPED
							</Text>

							<Grid templateColumns="repeat(6, 0fr)" gap="1rem">
								{Array.from({ length: 12 }, (_, i) => (
									<GridItem
										key={i}
										bgColor="blacks.400"
										h="3.5rem"
										w="3.5rem"
										borderRadius="0.25rem"
									/>
								))}
							</Grid>
						</Box>
					)}
				</GridItem>
				<GridItem
					area="scroller"
					display="flex"
					flexDir="column"
					color="white"
					fontSize="3rem"
				>
					<Flex
						flex="1"
						borderRadius="0.5rem"
						bg="blacks.400"
						cursor={canScrollUp ? "pointer" : "not-allowed"}
						opacity={canScrollUp ? "1" : "0.25"}
						justifyContent="center"
						alignItems="center"
						transition="all 0.1s ease"
						_hover={
							canScrollUp
								? {
										backgroundColor: "brand.quaternary",
								  }
								: {}
						}
						onClick={() => handleScroll("up")}
					>
						<ChevronUpIcon />
					</Flex>
					<Box h="1rem" />
					<Flex
						flex="1"
						borderRadius="0.5rem"
						bg="blacks.400"
						cursor={canScrollDown ? "pointer" : "not-allowed"}
						opacity={canScrollDown ? "1" : "0.25"}
						justifyContent="center"
						alignItems="center"
						transition="all 0.1s ease"
						_hover={
							canScrollDown
								? {
										backgroundColor: "brand.quaternary",
								  }
								: {}
						}
						onClick={() => handleScroll("down")}
					>
						<ChevronDownIcon />
					</Flex>
				</GridItem>
				<GridItem
					area="historyButton"
					display="flex"
					flexDirection="column"
					flex="0 0 auto"
					justifyContent="space-between"
					alignItems="flex-end"
				>
					{battleHistory && battleHistory.histories.length ? (
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
							onClick={handleBattleHistory}
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
					) : null}
				</GridItem>
				<GridItem area="battleButton">
					<Tip
						label={
							!currentCharacter.faction
								? "Join a faction first"
								: currentCharacter.army.length < 1
								? "Equip at least one unit first"
								: ""
						}
						placement="top"
					>
						<Button
							variant="solid"
							border="0.25rem solid"
							borderColor="blacks.700"
							_hover={
								enabled
									? {
											border: `0.25rem solid ${colors.brand.quaternary}`,
											bgColor: colors.brand.quaternary,
									  }
									: {}
							}
							width="100%"
							p="1rem 3.5rem"
							fontSize="1.5rem"
							cursor={enabled ? "pointer" : "not-allowed"}
							disabled={!enabled}
							opacity={enabled ? "1" : "0.5"}
							onClick={() => (enabled ? handleBattle() : null)}
						>
							{/* <Image
							src={"/assets/arena/helmet.svg"}
							w="2.5rem"
							h="2.5rem"
							alt="helmet"
							color="blue"
							mr="1rem"
							transform="scaleX(-1)" // Flip around the Y axis
						/> */}
							Battle
						</Button>
					</Tip>
				</GridItem>
			</Grid>
			{battleHistory ? (
				<BattleHistoryModal
					isOpen={isOpen}
					onClose={onClose}
					character={currentCharacter}
					opponent={opponent}
					history={battleHistory}
				/>
			) : null}
		</>
	)
}
