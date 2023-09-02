import { Frame } from "@/components/wizard/wizard.components"
import { Character } from "@/types/server"
import {
	Text,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	Grid,
	Flex,
	Box,
	HStack,
	IconButton,
	Tooltip,
	Input,
	VStack,
	Spinner,
	Img,
} from "@chakra-ui/react"
import { FC, useEffect, useState } from "react"
import styled from "@emotion/styled"
import {
	MdCheck,
	MdPersonAddAlt1,
	MdSend,
	MdPersonRemoveAlt1,
	MdChangeCircle,
	MdGroup,
} from "react-icons/md"
import { GiHammerSickle } from "react-icons/gi"
import { colors } from "@/styles/defaultTheme"
import { Label, Value } from "../tab.styles"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { PublicKey } from "@solana/web3.js"
import { useSolana } from "@/hooks/useSolana"
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter"
import {
	adjustVoteDelegation,
	delegateVotes,
	getCitizenPDA,
	getDelegationAccount,
	getDelegationRecordPDA,
	returnVoteDelegation,
	transferVotes,
} from "@/lib/solanaClient"
import { useCitizen } from "@/hooks/useCitizen"
import { useFaction } from "@/hooks/useFaction"
import { useFactionVP } from "@/hooks/useFactionVP"
import { decode } from "bs58"
import { LeaveFactionModal } from "../../leave-faction.component"

export const CitizenModal: FC<{
	citizens: Character[]
	onClose: () => void
	isOpen: boolean
	setFactionStatus: (value: boolean) => void
}> = ({ citizens, onClose, isOpen, setFactionStatus }) => {
	const [actionType, setActionType] = useState<
		"delegate" | "transfer" | "reclaim" | null
	>(null)
	const [activeCitizen, setActiveCitizen] = useState<string | null>(null)
	const [inputValue, setInputValue] = useState<string | number>("")
	const [delegationInProgress, setDelegationInProgress] =
		useState<boolean>(false)

	const queryClient = useQueryClient()
	const [selectedCharacter] = useSelectedCharacter()
	const { connection, walletAddress, signTransaction, encodeTransaction } =
		useSolana()
	const { data: currentCitizen, isLoading: isCitizenLoading } = useCitizen(
		selectedCharacter?.mint ?? "",
		connection,
	)
	const { data: factionData } = useFactionVP(
		selectedCharacter?.faction?.id ?? "",
		connection,
	)

	const handleTransferVotes = async (
		voteAmt: number,
		voteCharacterRecepientMint: string,
	) => {
		setDelegationInProgress(true)
		try {
			if (!selectedCharacter?.mint) {
				toast.error("No Character Selected")
				return
			}
			const encodedSignedTx = await encodeTransaction({
				walletAddress,
				connection,
				signTransaction,
				txInstructions: [
					await transferVotes(
						connection,
						new PublicKey(walletAddress!),
						new PublicKey(selectedCharacter?.mint!),
						voteAmt,
						new PublicKey(voteCharacterRecepientMint),
					),
				],
			})

			if (typeof encodedSignedTx === "string") {
				const sig = await connection.sendRawTransaction(decode(encodedSignedTx))
				toast.success("Transfer vote successful!")
			}

			await new Promise((resolve) => setTimeout(resolve, 2000))
		} catch (e) {
			console.log("Transfer vote failed: ", e)
			toast.error("Transfer vote failed")
		} finally {
			setInputValue("")
			setActionType(null)
			setActiveCitizen(null)
			setDelegationInProgress(false)
		}
	}

	const handleDelegation = async (
		voteAmt: number,
		voteCharacterRecepientMint: string,
	) => {
		setDelegationInProgress(true)
		currentCitizen
		const citizenPDA = getCitizenPDA(new PublicKey(currentCitizen?.mint!))
		const characterRecepientPDA = getCitizenPDA(
			new PublicKey(voteCharacterRecepientMint),
		)
		const delegationPDA = getDelegationRecordPDA(
			citizenPDA,
			characterRecepientPDA,
		)

		const dA = await getDelegationAccount(connection, delegationPDA)
		await new Promise((resolve) => setTimeout(resolve, 15000))

		if (!dA) {
			handleDelegateVotes(voteAmt, voteCharacterRecepientMint)
		} else {
			handleUpdateDelegatedVotes(voteAmt, voteCharacterRecepientMint)
		}
	}

	const handleDelegateVotes = async (
		voteAmt: number,
		voteCharacterRecepientMint: string,
	) => {
		try {
			if (!selectedCharacter?.mint) {
				toast.error("No Character Selected")
				return
			}
			if (voteAmt < 0) {
				toast.error("Initial delegation cannot be negative!")
				return
			}
			const encodedSignedTx = await encodeTransaction({
				walletAddress,
				connection,
				signTransaction,
				txInstructions: [
					await delegateVotes(
						connection,
						new PublicKey(walletAddress!),
						new PublicKey(selectedCharacter?.mint!),
						voteAmt,
						new PublicKey(voteCharacterRecepientMint),
					),
				],
			})
			if (typeof encodedSignedTx === "string") {
				const sig = await connection.sendRawTransaction(decode(encodedSignedTx))
				toast.success("Delegate vote successful!")
			}

			await new Promise((resolve) => setTimeout(resolve, 2000))
		} catch (e) {
			console.log("Delegate vote failed with error: ", e)
			toast.error("Delegate vote failed")
		} finally {
			setInputValue("")
			setActionType(null)
			setActiveCitizen(null)
			setDelegationInProgress(false)
		}
	}

	const handleUpdateDelegatedVotes = async (
		voteAmt: number,
		voteCharacterRecepientMint: string,
	) => {
		setDelegationInProgress(true)

		let isIncrement = true
		let normalizedVotingAmt = voteAmt

		try {
			if (voteAmt < 0) {
				isIncrement = false
				normalizedVotingAmt *= -1
			}
			if (!selectedCharacter?.mint) {
				toast.error("No Character Selected")
				return
			}
			const encodedSignedTx = await encodeTransaction({
				walletAddress,
				connection,
				signTransaction,
				txInstructions: [
					await adjustVoteDelegation(
						connection,
						new PublicKey(walletAddress!),
						new PublicKey(selectedCharacter?.mint!),
						new PublicKey(voteCharacterRecepientMint),
						normalizedVotingAmt,
						isIncrement,
					),
				],
			})

			if (typeof encodedSignedTx === "string") {
				const sig = await connection.sendRawTransaction(decode(encodedSignedTx))
				toast.success("Delegate vote successful!")
			}

			await new Promise((resolve) => setTimeout(resolve, 2000))
		} catch (e) {
			console.log("Return delegate votes failed with error: ", e)
			toast.error("Return delegate votes failed")
		} finally {
			setInputValue("")
			setActionType(null)
			setActiveCitizen(null)
			setDelegationInProgress(false)
		}
	}

	const handleReclaimDelegatedVotes = async (
		voteCharacterRecepientMint: string,
	) => {
		setDelegationInProgress(true)

		try {
			if (!selectedCharacter?.mint) {
				toast.error("No Character Selected")
				return
			}

			const citizenPDA = getCitizenPDA(new PublicKey(currentCitizen?.mint!))
			const characterRecepientPDA = getCitizenPDA(
				new PublicKey(voteCharacterRecepientMint),
			)
			const delegationPDA = getDelegationRecordPDA(
				citizenPDA,
				characterRecepientPDA,
			)
			const dA = await getDelegationAccount(connection, delegationPDA)
			await new Promise((resolve) => setTimeout(resolve, 15000))

			if (!dA) {
				toast.error("No votes have been delegated!")
				return
			}

			if (!dA.voteAmt) {
				toast.error("No vote amount found!")
				return
			}

			const encodedSignedTx = await encodeTransaction({
				walletAddress,
				connection,
				signTransaction,
				txInstructions: [
					await adjustVoteDelegation(
						connection,
						new PublicKey(walletAddress!),
						new PublicKey(selectedCharacter?.mint!),
						new PublicKey(voteCharacterRecepientMint),
						dA.voteAmt,
						false,
					),
				],
			})

			if (typeof encodedSignedTx === "string") {
				const sig = await connection.sendRawTransaction(decode(encodedSignedTx))
				toast.success("Delegate votes reclaimed successfuly!")
			}

			await new Promise((resolve) => setTimeout(resolve, 2000))
		} catch (e) {
			console.log("Reclaim delegate votes failed with error: ", e)
			toast.error("Reclaim delegate votes failed")
		} finally {
			setInputValue("")
			setActionType(null)
			setActiveCitizen(null)
			setDelegationInProgress(false)
		}
	}

	const isValidInput = (value: string): boolean => {
		if (value.trim() === "") return false
		const numberValue = parseFloat(value)
		if (isNaN(numberValue)) return false
		return true
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent
				p="1rem"
				minW={{ base: "95%", sm: "75rem" }}
				minH="600px"
				maxH="800px"
				bg="blacks.500"
				color="brand.secondary"
				borderRadius="1rem"
				overflow="auto"
			>
				<ModalBody>
					<Box mb="2rem">
						<HStack justifyContent="space-between" align="end">
							<Text fontSize="3rem" fontWeight={800} letterSpacing="4px">
								CITIZENS
							</Text>
							<Tooltip label="Population" hasArrow>
								<HStack pb="0.5rem">
									<MdGroup size="2.5rem" color={colors.brand.quaternary} />
									<CitizenValue ml="0.5rem">{citizens.length}</CitizenValue>
								</HStack>
							</Tooltip>
							<Tooltip label="Total Skills" hasArrow>
								<HStack pb="0.5rem">
									<GiHammerSickle size="2rem" color={colors.brand.quaternary} />
									<CitizenValue ml="0.5rem">
										{citizens?.length > 0 &&
											citizens
												.map((e) => Object.values(e.skills).reduce((a, b) => a + b))
												.reduce((a, b) => a + b)}
									</CitizenValue>
								</HStack>
							</Tooltip>

							<HStack pb="0.25rem">
								<CitizenLabel fontSize="2rem"> FACTION VP: </CitizenLabel>
								<Text
									fontSize="2rem"
									fontWeight={700}
									bg="brand.quaternary"
									color="brand.primary"
									w="fit-content"
									p="0rem 0.5rem"
									borderRadius="0.5rem"
									filter="drop-shadow(0 2px 2px rgba(0,0,0,0.25))"
								>
									{factionData.maxFactionVP}
								</Text>
							</HStack>

							<HStack pb="0.25rem">
								<CitizenLabel fontSize="2rem"> MY VP: </CitizenLabel>
								{!isCitizenLoading ? (
									<>
										<Text
											fontSize="2rem"
											fontWeight={700}
											bg="brand.quaternary"
											color="brand.primary"
											w="fit-content"
											p="0rem 0.5rem"
											borderRadius="0.5rem"
											filter="drop-shadow(0 2px 2px rgba(0,0,0,0.25))"
										>
											{Number(currentCitizen?.totalVotingPower) -
												Number(currentCitizen?.maxPledgedVotingPower)}
										</Text>
									</>
								) : (
									<Spinner size="md" color="white" mb="0.5rem" />
								)}
							</HStack>
						</HStack>
					</Box>
					<Grid templateColumns="repeat(auto-fill, minmax(33rem, 1fr))" gap="3rem">
						{citizens.map((citizen) => (
							<Flex direction="row" key={citizen.mint} position="relative">
								<Box>
									<Box position="relative">
										<Img
											borderRadius="1rem"
											style={{ height: "14rem", width: "14rem" }}
											alt="nft"
											src={citizen.image}
										/>
									</Box>
									<Tooltip label="Citizen VP" hasArrow>
										<Text
											position="absolute"
											top="0.5rem"
											left="0.5rem"
											fontSize="1.75rem"
											fontWeight={700}
											bg="brand.quaternary"
											color="brand.primary"
											w="fit-content"
											p="0 1rem"
											borderRadius="0.5rem"
											filter="drop-shadow(0 2px 2px rgba(0,0,0,0.25))"
										>
											{Object.values(citizen.skills).reduce((a, b) => a + b)}
										</Text>
									</Tooltip>
									{/* <Tooltip label="Skills" hasArrow>
                    <Text
                      position="absolute"
                      top="-0.5rem"
                      left="10rem"
                      fontSize="1.75rem"
                      fontWeight={700}
                      bg="brand.quaternary"
                      color="brand.primary"
                      w="fit-content"
                      p="0 1rem"
                      borderRadius="0.5rem"
                      filter="drop-shadow(0 2px 2px rgba(0,0,0,0.25))"
                    >
                      {Object.values(citizen.skills).reduce((a, b) => a + b)}
                    </Text>
                  </Tooltip> */}
									<Tooltip label="Delegated VP" hasArrow>
										<Text
											position="absolute"
											bottom="0.5rem"
											left="0.5rem"
											fontSize="1.75rem"
											fontWeight={700}
											bg={colors.blacks[700]}
											color="brand.secondary"
											w="fit-content"
											p="0 1rem"
											borderRadius="0.5rem"
											filter="drop-shadow(0 2px 2px rgba(0,0,0,0.25))"
										>
											{Object.values(citizen.skills).reduce((a, b) => a + b)}
										</Text>
									</Tooltip>
									{/* <Tooltip label="Skills" hasArrow>
                    <Text
                      position="absolute"
                      bottom="0rem"
                      left="10rem"
                      fontSize="1.75rem"
                      fontWeight={700}
                      bg="brand.quaternary"
                      color="brand.primary"
                      w="fit-content"
                      p="0 1rem"
                      borderRadius="0.5rem"
                      filter="drop-shadow(0 2px 2px rgba(0,0,0,0.25))"
                    >
                      {Object.values(citizen.skills).reduce((a, b) => a + b)}
                    </Text>
                  </Tooltip> */}
								</Box>
								<Flex
									direction="column"
									justifyContent="space-between"
									position="relative"
									ml="2rem"
								>
									<VStack align="start" gap="0" mb="1rem">
										<Flex align="center" m="0rem" p="0rem">
											<CitizenLabel> SKILLS: </CitizenLabel>
											<CitizenValue ml="0.5rem">
												{Object.values(citizen.skills).reduce((a, b) => a + b)}
											</CitizenValue>
										</Flex>
										<Text
											noOfLines={1}
											textOverflow="ellipsis"
											fontFamily="header"
											fontSize="2rem"
											letterSpacing="2px"
											fontWeight="100"
											mt="0rem"
										>
											{citizen.name.split(" ")[0]}
										</Text>
										<Text
											noOfLines={1}
											textOverflow="ellipsis"
											fontFamily="header"
											letterSpacing="1px"
											fontWeight="800"
											fontSize="1.75rem"
											textTransform="uppercase"
										>
											{citizen.name.split(" ")[1]}
										</Text>
									</VStack>
									<Flex>
										{delegationInProgress ? (
											<Flex alignItems="center">
												<Spinner color="white" />
												<Text ml="0.5rem" color="white" fontSize="1rem">
													LOADING...
												</Text>
											</Flex>
										) : actionType && activeCitizen === citizen.mint ? (
											<Flex width="100%" mr="1rem">
												<StyledInput
													placeholder="Amount"
													type="number"
													value={inputValue}
													onChange={(e) => setInputValue(e.target.value)}
												/>
												<IconButton
													aria-label="Confirm"
													icon={<MdCheck />}
													bg={colors.brand.quaternary}
													borderRadius="0rem 0.5rem 0.5rem 0rem"
													color="white"
													p="0rem 1rem"
													h="4rem"
													_hover={{ bg: colors.blacks[700] }}
													onClick={() => {
														if (isValidInput(inputValue as string)) {
															if (actionType === "delegate") {
																handleDelegation(Number(inputValue), citizen.mint)
															} else if (actionType === "transfer") {
																handleTransferVotes(Number(inputValue), citizen.mint)
															}
														} else {
															alert("Please enter a valid number.")
														}
													}}
												/>
											</Flex>
										) : (
											<Flex justifyContent="space-between" gap="1rem">
												{currentCitizen.mint === citizen.mint ? (
													<LeaveFactionModal
														character={selectedCharacter!}
														setFactionStatus={setFactionStatus}
													/>
												) : (
													<>
														<Tooltip label="Reclaim Delegated" hasArrow>
															<IconButton
																aria-label="Confirm"
																icon={<MdPersonRemoveAlt1 />}
																bg={colors.blacks[700]}
																borderRadius="0.5rem"
																color="white"
																p="0rem 2rem"
																h="4rem"
																onClick={() => handleReclaimDelegatedVotes(citizen.mint)}
															/>
														</Tooltip>
														<Tooltip label="Delegate Votes" hasArrow>
															<IconButton
																aria-label="Delegate Votes"
																icon={<MdPersonAddAlt1 />}
																bg={colors.blacks[700]}
																color="white"
																p="0rem 2rem"
																h="4rem"
																onClick={() => {
																	setActionType("delegate")
																	setActiveCitizen(citizen.mint)
																}}
															/>
														</Tooltip>
														<Tooltip label="Transfer Votes" hasArrow>
															<IconButton
																aria-label="Transfer Votes"
																icon={<MdSend />}
																bg={colors.blacks[700]}
																color="white"
																p="0rem 2rem"
																h="4rem"
																onClick={() => {
																	setActionType("transfer")
																	setActiveCitizen(citizen.mint)
																}}
															/>
														</Tooltip>
													</>
												)}
											</Flex>
										)}
									</Flex>
								</Flex>
							</Flex>
						))}
					</Grid>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

export const CitizenLabel = styled(Text)`
	font-size: 1.25rem;
	font-weight: 400;
	text-transform: uppercase;
	letter-spacing: 0.6px;
`
export const CitizenValue = styled(Text)`
	font-size: 2rem;
	font-weight: 700;
	text-transform: uppercase;
`

const inputStyles = {
	backgroundColor: colors.blacks[600],
	height: "4rem",
	borderRadius: "0.5rem 0rem 0rem 0.5rem",
	padding: "0.5rem 1rem",
	fontWeight: "500",
	fontSize: "10px",
	letterSpacing: "1px",
	color: colors.brand.secondary,
}

const StyledInput = styled(Input)`
	${inputStyles}

	&:disabled {
		background-color: ${colors.blacks[500]} !important;
	}
`
