import {
	Box,
	Button,
	Flex,
	HStack,
	Input,
	Tooltip,
	Spinner,
	Text,
	VStack,
} from "@chakra-ui/react"
import { css } from "@emotion/react"
import { Label, PanelContainer, Value, ValueCalculation } from "../tab.styles"
import { colors } from "@/styles/defaultTheme"
import styled from "@emotion/styled"
import { sendTransaction, useSolana } from "@/hooks/useSolana"
import { Character } from "@/types/server"
import { useContext, useEffect, useState } from "react"
import { CreateProposal } from "../../create-proposal-modal/create-proposal.component"
import { useProposalsByFaction } from "@/hooks/useProposalsByFaction"
import { useAllProposalsByFaction } from "@/hooks/useAllProposalsByFaction"
import { Proposal } from "@/types/server/Proposal"
import {
	Connection,
	PublicKey,
	sendAndConfirmTransaction,
	TransactionInstruction,
	VersionedTransaction,
} from "@solana/web3.js"
import {
	getCitizenPDA,
	getFactionAccount,
	getFactionPDA,
	getProposalAccount,
	getProposalPDA,
	getVoteAccount,
	getVotePDA,
	updateVoteOnProposalIx,
	voteOnProposalIx,
} from "@/lib/solanaClient"
import { useProposalAccountServer } from "@/hooks/useProposalAccountServer"
import { BN } from "@coral-xyz/anchor"
import { useProposalVotesByCitizen } from "@/hooks/useProposalVotesByCitizen"
import { useFaction } from "@/hooks/useFaction"
import { decode } from "bs58"
import { TransactionMessage } from "@solana/web3.js"
import { useCitizen, CitizenAccountInfo } from "@/hooks/useCitizen"
import { LeaveFactionModal } from "../../leave-faction.component"
import toast from "react-hot-toast"
import { useProcessProposal } from "@/hooks/useProcessProposal"
import { useProposalVoteInfo } from "@/hooks/useProposalVoteInfo"
import { useVoteThreshold } from "@/hooks/useVoteThreshold"
import { useProposalVotesAll } from "@/hooks/useProposalVotesAll"
import { useQueryClient } from "@tanstack/react-query"
import { ToolTip } from "@/styles/brand-components"
import { Tip } from "@/components/tooltip"
import { MainContext } from "@/contexts/MainContext"

const spacing = "1rem"
type FactionTabPoliticsProps = {
	setFactionStatus: (value: boolean) => void
	fire: () => void
	openCitizenModal: () => void
}

export const FactionTabPolitics: React.FC<FactionTabPoliticsProps> = ({
	setFactionStatus,
	fire: fireConfetti,
	openCitizenModal,
}) => {
	const { selectedCharacter: currentCharacter } = useContext(MainContext)
	const [isLoading, setIsLoading] = useState(false)
	const [voteThreshold, setVoteThreshold] = useState<string>("")
	const [votingPower, setVotingPower] = useState<string>("")
	const [proposalIds, setProposalIds] = useState<string[]>()
	const [allProposalIds, setAllProposalIds] = useState<string[]>()
	const factionId = currentCharacter?.faction?.id ?? ""

	const { data: factionData } = useFaction({ factionId })
	const {
		connection,
		walletAddress,
		signTransaction,
		signAllTransactions,
		encodeTransaction,
		sendTransaction,
	} = useSolana()
	const {
		data: allVotingProposals,
		isLoading: allVotingProposalsIsLoading,
		isError: allVotingProposalsError,
	} = useProposalsByFaction(factionId, 0, 100)
	const {
		data: allProposals,
		isLoading: allProposalsIsLoading,
		isError: allProposalsError,
	} = useAllProposalsByFaction(factionId)
	const { data: citizen, isLoading: isCitizenLoading } = useCitizen(
		currentCharacter?.mint!,
		connection,
	)
	const { data: vT, isLoading: isThresholdLoading } = useVoteThreshold(
		currentCharacter!,
		connection,
	)
	const { data: votesData } = useProposalVotesAll(proposalIds)

	useEffect(() => {
		if (allProposals && !allProposalsIsLoading) {
			const ids = allProposals.proposals.map(
				(proposal: Proposal) => proposal.id,
			) as string[]
			setAllProposalIds(ids)
		}
	}, [allProposals, allProposalsIsLoading])

	useEffect(() => {
		if (allVotingProposals && !allVotingProposalsIsLoading) {
			const ids = allVotingProposals.proposals.map(
				(proposal: Proposal) => proposal.id,
			) as string[]
			setProposalIds(ids)
		}
	}, [allVotingProposals, allVotingProposalsIsLoading])

	useEffect(() => {
		if (votesData) {
			if (typeof votesData === "string") {
				setVotingPower(votesData)
			} else if ("data" in votesData) {
				setVotingPower(votesData.data)
			}
		}
	}, [votesData])

	useEffect(() => {
		if (vT && !isThresholdLoading) {
			setVoteThreshold(vT)
		}
	}, [isThresholdLoading, vT])

	useEffect(() => {
		setFactionStatus(!!currentCharacter?.faction)
	}, [currentCharacter, setFactionStatus])

	const sortedProposals = allVotingProposals?.proposals
		?.slice()
		.sort((a: Proposal, b: Proposal) => {
			return new Date(b.created).getTime() - new Date(a.created).getTime()
		})

	const fetchVotesForProposal = async (proposalId: string) => {
		const propPDA = getProposalPDA(proposalId)
		const citiPDA = getCitizenPDA(new PublicKey(currentCharacter?.mint!))
		const votePDA = getVotePDA(citiPDA, propPDA)
		await new Promise((resolve) => setTimeout(resolve, 1000))

		const vA = await getVoteAccount(connection, votePDA)
		await new Promise((resolve) => setTimeout(resolve, 1000))

		return vA ? parseInt(vA.voteAmt.toString(), 10) : 0
	}

	const updateVote = async (votingAmt: number, currentProposalId: string) => {
		let isIncrement = true
		let normalizedVotingAmt = votingAmt

		try {
			if (votingAmt < 0) {
				isIncrement = false
				normalizedVotingAmt *= -1
			}
			const encodedSignedTx = await encodeTransaction({
				walletAddress,
				connection,
				signTransaction,
				txInstructions: [
					await updateVoteOnProposalIx(
						connection,
						new PublicKey(walletAddress!),
						new PublicKey(currentCharacter?.mint!),
						currentProposalId!,
						votingAmt,
						currentCharacter?.faction?.id!,
						isIncrement,
					),
				],
			})

			if (typeof encodedSignedTx === "string") {
				const sig = await connection.sendRawTransaction(decode(encodedSignedTx))
				toast.success("Update vote successful!")
			}

			await new Promise((resolve) => setTimeout(resolve, 2000))
		} catch (e) {
			console.error("Update failed: ", e)
		}
	}

	const updateAllVotes = async (
		votingAmts: number[],
		currentProposalIds: string[],
	) => {
		let ixs: TransactionInstruction[] = []

		// Create transaction instructions based on voting amounts and proposal IDs
		for (let i = 0; i < votingAmts.length; i++) {
			let isIncrement = true
			let normalizedVotingAmt = votingAmts[i]

			if (votingAmts[i] < 0) {
				isIncrement = false
				normalizedVotingAmt *= -1
			}

			const instruction = await updateVoteOnProposalIx(
				connection,
				new PublicKey(walletAddress!),
				new PublicKey(currentCharacter?.mint!),
				currentProposalIds[i]!,
				normalizedVotingAmt,
				currentCharacter?.faction?.id!,
				isIncrement,
			)
			ixs.push(instruction)
		}

		const chunkSize = 10 // Define the chunk size
		for (let i = 0; i < ixs.length; i += chunkSize) {
			const currentChunk = ixs.slice(i, i + chunkSize)
			try {
				const encodedSignedTx = await encodeTransaction({
					walletAddress,
					connection,
					signTransaction,
					txInstructions: currentChunk, // Send only the current chunk
				})

				if (typeof encodedSignedTx === "string") {
					await connection.sendRawTransaction(decode(encodedSignedTx))
					toast.success(`Update vote ${i / chunkSize + 1} successful!`)
				}
				await new Promise((resolve) => setTimeout(resolve, 2000))
			} catch (e) {
				console.error(`Update failed for chunk ${i / chunkSize + 1}:`, e)
			}
		}
	}

	const reclaimProposalVotes = async () => {
		setIsLoading(true)

		if (!allProposalIds || allProposalIds.length === 0) {
			toast.error("You have no outstanding votes")
			setIsLoading(false)
			return
		}

		if (!signAllTransactions) {
			toast.error("Ledger wallets do not support this function")
			setIsLoading(false)
			return
		}

		const voteAmounts = await Promise.all(
			allProposalIds.map(fetchVotesForProposal),
		)
		const proposalIdsToSend: string[] = []
		const voteAmountsToSend: number[] = []

		for (let i = 0; i < allProposalIds.length; i++) {
			if (voteAmounts[i] > 0) {
				proposalIdsToSend.push(allProposalIds[i])
				voteAmountsToSend.push(-voteAmounts[i])
			}
		}

		await updateAllVotes(voteAmountsToSend, proposalIdsToSend)
		toast.success("All votes reclaimed!")
		setIsLoading(false)
	}

	useEffect(() => {}, [factionData, currentCharacter?.faction])

	const renderContent = () => {
		if (isLoading || allVotingProposalsIsLoading || allVotingProposalsError) {
			return (
				<VStack gap={spacing} align="center">
					<LoadingContainer>
						<Spinner size="lg" color="white" />
						<LoadingText>LOADING</LoadingText>
					</LoadingContainer>
				</VStack>
			)
		}
		return (
			<VStack gap={spacing}>
				<Flex justifyContent="space-between" alignItems="end" mb={spacing} w="100%">
					<MenuTitle>proposals</MenuTitle>
					<Flex alignItems="end">
						<Tip label="You'll need to unstake votes from voted on proposals to reuse them in other proposals.">
							<Text
								fontSize="1.5rem"
								color="brand.secondary"
								cursor="pointer"
								_hover={{
									textDecoration: "underline",
								}}
								onClick={reclaimProposalVotes}
							>
								UNSTAKE VOTES
							</Text>
						</Tip>
					</Flex>
					<Flex alignItems="end">
						<CreateProposal
							currentCharacter={currentCharacter!}
							fire={fireConfetti}
							factionData={factionData}
						/>
					</Flex>
				</Flex>
				{allVotingProposals.total === 0 ? (
					<ProposalAction>
						<Value>NO PROPOSALS CREATED</Value>
					</ProposalAction>
				) : (
					sortedProposals?.map((proposal: Proposal) => (
						<ProposalItem
							key={proposal.id}
							proposal={proposal}
							currentCharacter={currentCharacter!}
							voteThreshold={voteThreshold}
							setIsLoading={setIsLoading}
							connection={connection}
						/>
					))
				)}
			</VStack>
		)
	}

	return (
		<PanelContainer display="flex" flexDirection="column" gap="4rem">
			<Flex justifyContent="space-between">
				<Header factionName={currentCharacter?.faction?.name} />
				<Flex alignItems="end"></Flex>
				<HStack alignItems="end" pb="0.5rem">
					<Label color={colors.brand.tertiary} pb="0.25rem">
						Voting Power:
					</Label>
					{!isCitizenLoading ? (
						<>
							<Tip label="Current usable voting power">
								<Value>
									{Number(citizen?.totalVotingPower) -
										Number(citizen?.maxPledgedVotingPower)}
								</Value>
							</Tip>
							<Tip label="Granted Voting Power + Delegated Voting Power - Staked Voting Power">
								<ValueCalculation
									color={colors.brand.tertiary}
									pl="0.25rem"
									pb="0.25rem"
								>
									({citizen?.grantedVotingPower.toString()}
									{" + "}
									{citizen?.delegatedVotingPower.toString()}
									{" - "}
									{citizen?.maxPledgedVotingPower.toString()})
								</ValueCalculation>
							</Tip>
						</>
					) : (
						<Spinner size="md" color="white" mb="0.5rem" />
					)}
				</HStack>
			</Flex>

			<Flex>
				<CitizensButton
					onClick={openCitizenModal}
					cursor="pointer"
					_hover={{
						borderColor: colors.blacks[600],
						bg: colors.blacks[600],
					}}
				>
					citizens
				</CitizensButton>
				{/* <LeaveFactionModal
          character={currentCharacter}
          setFactionStatus={setFactionStatus}
        /> */}
			</Flex>
			{renderContent()}
		</PanelContainer>
	)
}

type ProposalItemProps = {
	proposal: Proposal
	currentCharacter: Character
	voteThreshold: string
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
	connection: Connection
}

enum ProposalStatus {
	VOTING = "VOTING",
	PASSED = "PASSED",
	CLOSED = "CLOSED",
}

type ProposalTypeDetailsProps = {
	type: string
	proposal: any
}

const ProposalTypeDetails: React.FC<ProposalTypeDetailsProps> = ({
	type,
	proposal,
}) => {
	return (
		<HStack alignItems="end" ml="5rem">
			<Label color={colors.brand.tertiary} pb="0.4rem">
				{getLabel(type)}:
			</Label>
			<ProposalTitle>{getValue(proposal?.type, proposal?.proposal)}</ProposalTitle>
		</HStack>
	)
}

const getLabel = (type: string) => {
	switch (type) {
		case "BUILD":
			return "Blueprint Name"
		case "UPGRADE":
			return "Station ID"
		case "ATK_CITY":
			return "Faction ID"
		case "ATK_RF":
			return "RF ID"
		case "WITHDRAW":
			return "Citizen"
		case "MINT":
			return "New Shares To Mint"
		case "ALLOCATE":
			return "Citizen"
		case "THRESHOLD":
			return "New Threshold"
		case "WARBAND":
			return "Warband"
		case "TAX":
			return "New Tax Rate"
		case "TAX":
			return "Burn Resources"
		default:
			return ""
	}
}

const getValue = (type: string, proposal: any) => {
	switch (type) {
		case "BUILD":
			return proposal.blueprintName
		case "UPGRADE":
			return proposal.stationId
		case "ATK_CITY":
			return proposal.factionId
		case "ATK_RF":
			return proposal.rfId
		case "WITHDRAW":
			return proposal.citizen
		case "MINT":
			return proposal.newSharesToMint
		case "ALLOCATE":
			return `${proposal.citizen} - Amount: ${proposal.amount}`
		case "THRESHOLD":
			return proposal.newThreshold
		case "WARBAND":
			return proposal.warband?.join(", ")
		case "TAX":
			return `${proposal.newTaxRate}%`
		case "BURN":
			return `${proposal.resources}`
		default:
			return ""
	}
}

const ProposalItem: React.FC<ProposalItemProps> = ({
	proposal,
	currentCharacter,
	voteThreshold,
	setIsLoading,
	connection,
}) => {
	const { id: proposalId, type } = proposal
	const [isVoteInProgress, setIsVoteInProgress] = useState<boolean>(false)
	const [localVote, setLocalVote] = useState<string>("")
	const [inputError, setInputError] = useState<string | null>(null)

	const { walletAddress, signTransaction, encodeTransaction } = useSolana()

	const { data, isLoading: proposalVoteInfoIsLoading } = useProposalVoteInfo(
		proposalId!,
		connection!,
	)
	const { voteAccountExists, totalVoteAmount, personalVoteAmount } = data

	const validateInput = (): boolean => {
		const isValid = !!localVote.trim() && !isNaN(parseInt(localVote))
		setInputError(isValid ? null : "Invalid vote input")
		return isValid
	}

	const queryClient = useQueryClient()

	const handleVote = async (votingAmt: number) => {
		setIsVoteInProgress(true)
		try {
			const ix = await voteOnProposalIx(
				connection,
				new PublicKey(walletAddress!),
				new PublicKey(currentCharacter?.mint!),
				proposalId!,
				votingAmt,
				currentCharacter?.faction?.id!,
			)
			const sig = await sendTransaction({
				connection,
				ixs: [ix],
				wallet: walletAddress!,
				signTransaction,
			})
			setLocalVote("")

			await new Promise((resolve) => setTimeout(resolve, 15000))

			queryClient.refetchQueries(["proposalInfo", proposalId]).then(() => {
				console.log("rffff")
				queryClient.refetchQueries({ queryKey: ["citizen"] }).then(() => {
					setIsVoteInProgress(false)
					toast.success("Vote successful!")
				})
			})
		} catch (e) {
			console.log("Vote failed: ", e)
			toast.error("Vote failed")
			setIsVoteInProgress(false)
		}
	}

	const updateVote = async (votingAmt: number) => {
		setIsVoteInProgress(true)
		let isIncrement = true
		let normalizedVotingAmt = votingAmt

		try {
			if (votingAmt < 0) {
				isIncrement = false
				normalizedVotingAmt *= -1
			}

			const ix = await updateVoteOnProposalIx(
				connection,
				new PublicKey(walletAddress!),
				new PublicKey(currentCharacter?.mint!),
				proposalId!,
				votingAmt,
				currentCharacter?.faction?.id!,
				isIncrement,
			)
			const sig = await sendTransaction({
				connection,
				ixs: [ix],
				wallet: walletAddress!,
				signTransaction,
			})

			setLocalVote("")
			await new Promise((resolve) => setTimeout(resolve, 15000))

			queryClient.refetchQueries(["proposalInfo", proposalId]).then(() => {
				queryClient.refetchQueries({ queryKey: ["citizen"] }).then(() => {
					setIsVoteInProgress(false)
					toast.success("Update vote successful!")
				})
			})
		} catch (e) {
			console.log("Update vote failed: ", e)
			toast.error("Failed to update vote")
			setIsVoteInProgress(false)
		}
	}

	const processProposalMutation = useProcessProposal(setIsLoading, proposal?.id)

	return (
		<ProposalAction>
			<Flex width="100%" flexDirection="column">
				<Flex justifyContent="space-between" mb="1rem">
					<HStack alignItems="end" pr="5rem">
						<Label color={colors.brand.tertiary} pb="0.4rem">
							type:
						</Label>
						<ProposalTitle>{type}</ProposalTitle>
						<ProposalTypeDetails type={type} proposal={proposal} />
					</HStack>
					<HStack alignItems="end" pr="1rem">
						<Label color={colors.brand.tertiary} pb="0.4rem">
							votes:
						</Label>

						<VoteFlex>
							{personalVoteAmount &&
							!proposalVoteInfoIsLoading &&
							!isVoteInProgress ? (
								<Tooltip
									label={`Your vote amount: ${personalVoteAmount}`}
									aria-label="A tooltip"
								>
									{totalVoteAmount}
								</Tooltip>
							) : (
								<Spinner size="md" color="white" />
							)}
							/{voteThreshold ? voteThreshold : <Spinner size="md" color="white" />}
						</VoteFlex>
					</HStack>
				</Flex>

				<HStack alignItems="end" mb="2rem">
					<Label color={colors.brand.tertiary} pb="0.25rem">
						proposal id:
					</Label>
					<Value style={{ textTransform: "lowercase" }}>{proposalId}</Value>
				</HStack>

				<Flex width="100%">
					{isVoteInProgress || proposalVoteInfoIsLoading ? (
						<HStack gap={spacing}>
							<Spinner size="md" color="white" />
							<LoadingText style={{ marginTop: "0px" }}>LOADING...</LoadingText>
						</HStack>
					) : (
						<Box w="100%">
							<Flex flexDirection="row" w="100%">
								<StyledInput
									placeholder={"Enter amount of voting power"}
									value={localVote}
									onChange={(e) => setLocalVote(e.target.value)}
									isInvalid={!!inputError}
									disabled={
										isVoteInProgress || Number(totalVoteAmount) >= Number(voteThreshold)
									}
								/>
								<Button
									ml="2rem"
									letterSpacing="1px"
									bg={colors.blacks[700]}
									onClick={() => {
										if (
											voteAccountExists &&
											Number(totalVoteAmount) >= Number(voteThreshold)
										) {
											processProposalMutation.mutate()
										} else if (validateInput() && voteAccountExists) {
											updateVote(parseInt(localVote))
										} else if (validateInput()) {
											handleVote(parseInt(localVote))
										}
									}}
									disabled={isVoteInProgress}
								>
									{voteAccountExists && Number(totalVoteAmount) >= Number(voteThreshold)
										? "process"
										: voteAccountExists
										? "add votes"
										: "vote"}
								</Button>
							</Flex>
							{inputError && <Text color="red.500">{inputError}</Text>}
						</Box>
					)}
				</Flex>
			</Flex>
		</ProposalAction>
	)
}

const Header: React.FC<{ factionName: string | undefined }> = ({
	factionName,
}) => {
	return (
		<Flex justifyContent="space-between" alignItems="end">
			<Title verticalAlign="end">{factionName!}</Title>
		</Flex>
	)
}

function handleError(error: Error | string) {
	console.error(error)
	const errorMessage = typeof error === "string" ? error : error.message
	toast.error(errorMessage)
}

const CitizensButton = styled(Button)`
	border-radius: 0.5rem;
	border: 3px solid ${colors.blacks[700]};
	margin: 0rem;
	width: 100%;
	font-size: 1.75rem;
	font-weight: 600;
	letter-spacing: 1px;
`

const Title = styled(Text)`
	text-transform: uppercase;
	font-size: 3rem;
	font-weight: 700;
`

const MenuTitle = styled(Text)`
	font-size: 2rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 1px;
	text-decoration: underline;
`

const ProposalTitle = styled(Text)`
	text-transform: uppercase;
	font-size: 2.25rem;
	font-weight: 800;
	font-spacing: 3px;
`

const VoteFlex = styled(Flex)`
	text-transform: uppercase;
	font-size: 2.25rem;
	font-weight: 800;
	font-spacing: 3px;
`

const ProposalAction = styled(Flex)`
	background-color: ${colors.blacks[500]};
	width: 100%;
	padding: 1.5rem;
	border-radius: ${spacing};
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
`

const LoadingContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const LoadingText = styled.div`
	color: white;
	font-weight: 800;
	font-size: 12px;
	margin-top: 8px;
`

const inputStyles = css`
	background-color: ${colors.blacks[600]};
	height: 5rem;
	width: 100%;
	border-radius: 4px;
	padding: 1rem 2rem;
	font-weight: 500;
	letter-spacing: 1px;
`

const StyledInput = styled(Input)`
	${inputStyles}
`
