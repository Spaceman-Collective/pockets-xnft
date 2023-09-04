import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { MdLeaderboard } from "react-icons/md"

import { useSolana } from "@/hooks/useSolana"
import { usePrizePool } from "@/hooks/useWalletAssets"
import { formatBalance } from "@/lib/utils"
import { colors } from "@/styles/defaultTheme"
import { Button, Flex, Spinner, Text } from "@chakra-ui/react"
import styled from "@emotion/styled"

import { Tip } from "../tooltip"

export const DashboardInfo = () => {
	const router = useRouter()
	const { walletAddress, connection, getBonkBalance } = useSolana()
	const [bonkBalance, setBonkBalance] = useState<string>()

	const { data: prizePool, isLoading, setIsLoading } = usePrizePool()

	useEffect(() => {
		;(async () => {
			if (walletAddress && connection) {
				setIsLoading(true)
				let balance = await getBonkBalance({ walletAddress, connection })
				const wholeBalance = Math.floor(balance)

				setBonkBalance(formatBalance(wholeBalance))
				setIsLoading(false)
			}
		})()
	}, [walletAddress, connection, setIsLoading, getBonkBalance])

	return (
		<Flex justifyContent="space-between" mt="1rem" mb="2rem">
			<Flex alignItems="center">
				<Text
					fontSize="1.75rem"
					lineHeight="1.75rem"
					fontWeight="500"
					letterSpacing="1px"
					color={colors.brand.tertiary}
				>
					BONK:
				</Text>

				{isLoading && <Spinner />}
				{!isLoading && prizePool && (
					<Text
						fontSize="1.75rem"
						lineHeight="1.75rem"
						fontWeight="700"
						letterSpacing="1px"
						color={colors.brand.secondary}
						ml="0.5rem"
					>
						{bonkBalance}
					</Text>
				)}
				<Link href="https://jup.ag/swap/SOL-Bonk" target="_blank">
					<Button
						variant="outline"
						fontSize="1rem"
						py="0.5rem"
						ml="1.25rem"
						opacity="0.5"
						_hover={{
							opacity: 0.6,
						}}
					>
						Buy
					</Button>
				</Link>
			</Flex>
			<Flex>
				<Tip label="The total BONK in the server wallet. 60% of this is reserved for three prize categories.">
					<Flex alignItems="center" mr="2rem">
						<Text
							fontSize="1.75rem"
							lineHeight="1.75rem"
							fontWeight="500"
							letterSpacing="1px"
							color={colors.brand.tertiary}
						>
							PRIZE POOL:
						</Text>

						{isLoading && <Spinner />}
						{!isLoading && prizePool && (
							<Text
								fontSize="1.75rem"
								lineHeight="1.75rem"
								fontWeight="700"
								letterSpacing="1px"
								color={colors.brand.secondary}
								ml="0.5rem"
							>
								{prizePool}
							</Text>
						)}
					</Flex>
				</Tip>
				<Flex gap="2rem">
					<Tip label="Leaderboard">
						<IconButton onClick={() => router.push("/leaderboard")}>
							<MdLeaderboard
								size={24}
								color={
									router.pathname === "/leaderboard"
										? colors.brand.quaternary
										: colors.brand.secondary
								}
							/>
						</IconButton>
					</Tip>
				</Flex>
			</Flex>
		</Flex>
	)
}

const Label = styled(Text)`
	margin: 0 auto;
	border-radius: 0.5rem;
	padding: 0.5rem;
	font-size: 1.5rem;
	font-weight: 400;
	letter-spacing: 1px;
	color: ${colors.brand.tertiary};
`
const Value = styled(Text)`
	border-radius: 0.5rem;
	padding: 0.25rem;
	font-size: 2rem;
	font-weight: 600;
	letter-spacing: 1px;
`

const IconButton = styled(Button)`
	align-items: end;
	padding: 0.5rem;

	svg {
		transition: all 0.25s ease-in-out;
	}
	svg:hover {
		fill: ${colors.brand.quaternary};
	}
`
