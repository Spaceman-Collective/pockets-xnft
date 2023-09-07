import { Box, Button } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { colors } from "@/styles/defaultTheme"
import { Tip } from "../tooltip"

export const DashboardMenu = () => {
	const router = useRouter()

	return (
		<Box cursor="pointer" display="flex" justifyContent="space-between">
			<Tip
				label="Character agnostic resources and units that live in your wallet."
				placement="top"
			>
				<Button
					bg={colors.brand.primary}
					color={
						router.pathname === "/wallet"
							? colors.brand.quaternary
							: colors.brand.secondary
					}
					borderRadius="0.5rem"
					p="0.25rem"
					fontSize="18px"
					fontWeight={600}
					letterSpacing="3px"
					h="6rem"
					flex="1"
					mr="1rem"
					minW="38rem"
					onClick={() => router.push({ pathname: "/wallet" })}
				>
					INVENTORY
				</Button>
			</Tip>
			<Button
				bg={colors.brand.primary}
				color={
					router.pathname === "/character"
						? colors.brand.quaternary
						: colors.brand.secondary
				}
				borderRadius="0.5rem"
				p="0.25rem"
				fontSize="18px"
				fontWeight={600}
				letterSpacing="3px"
				h="6rem"
				flex="1"
				ml="1rem"
				mr="1rem"
				onClick={() => router.push({ pathname: "/character" })}
			>
				CHARACTER
			</Button>
			<Button
				bg={colors.brand.primary}
				color={
					router.pathname === "/faction"
						? colors.brand.quaternary
						: colors.brand.secondary
				}
				borderRadius="0.5rem"
				p="0.25rem"
				fontSize="18px"
				fontWeight={600}
				letterSpacing="3px"
				h="6rem"
				flex="1"
				ml="1rem"
				onClick={() => router.push({ pathname: "/faction" })}
			>
				FACTION
			</Button>
		</Box>
	)
}
