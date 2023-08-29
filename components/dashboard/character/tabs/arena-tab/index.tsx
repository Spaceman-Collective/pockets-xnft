import { FC } from "react"
import {
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Image,
	Input,
	Spacer,
	Text,
} from "@chakra-ui/react"
import { BellIcon, Search2Icon, SearchIcon } from "@chakra-ui/icons"
import { PanelContainer } from "@/components/layout"
import { colors } from "@/styles/defaultTheme"

export const ArenaTab: FC = () => {
	return (
		<PanelContainer
			display="flex"
			flexDirection="column"
			gap="2rem"
			width={"100%"}
		>
			<Header />
			<SearchBar />
			<Box overflowY="auto" gap="2rem">
				<Opponent enabled={true} />
				<Opponent enabled={false} />
				<Opponent enabled={true} />
				<Opponent enabled={true} />
				<Opponent enabled={true} />
			</Box>
		</PanelContainer>
	)
}

const Header = () => {
	return (
		<Box>
			<Flex justifyContent="space-between" alignItems="center">
				<Flex>
					{/* Total Battle Points and Current Combat Level */}
					<Text
						textTransform="uppercase"
						fontSize="1.5rem"
						lineHeight="1.5rem"
						fontWeight="600"
						color="brand.tertiary"
					>
						Total Battle Points:{" "}
						<Text as="span" color="brand.secondary">
							0
						</Text>
					</Text>
					<Spacer width="2rem" />
					<Text
						textTransform="uppercase"
						fontSize="1.5rem"
						lineHeight="1.5rem"
						fontWeight="600"
						color="brand.tertiary"
					>
						Current Combat Level:{" "}
						<Text as="span" color="brand.secondary">
							0
						</Text>
					</Text>
				</Flex>
				<Box>
					<BellIcon fontSize="2.5rem" />
				</Box>
			</Flex>
		</Box>
	)
}

const SearchBar = () => {
	return (
		<Flex
			width="100%"
			backgroundColor="blacks.500"
			borderRadius="0.5rem"
			alignItems="center"
		>
			{/* Search Bar */}
			<Input
				display="block"
				flex="1"
				fontSize="2rem"
				lineHeight="2rem"
				fontWeight="600"
				placeholder="Search Opponents"
				backgroundColor="transparent"
				outline="none"
				textTransform="uppercase"
				padding="1.75rem"
				color="brand.secondary"
			/>
			<SearchIcon color="brand.tertiary" fontSize="2.25rem" margin="2rem" />
		</Flex>
	)
}

const Opponent = ({ enabled }: { enabled: boolean }) => {
	return (
		<Flex
			w="100%"
			bgColor="blacks.500"
			borderRadius="0.5rem"
			p="1.75rem"
			_notLast={{ marginBottom: "2rem" }}
		>
			<Flex w="100%">
				<Flex
					flex="0 0 auto"
					bgColor="brand.tertiary"
					borderRadius="0.5rem"
					w="12rem"
					h="12rem"
					p="1rem"
					justifyContent="space-between"
				>
					<Text fontSize="2rem" fontWeight="700" lineHeight="2rem">
						5
					</Text>
					<Box
						backgroundColor="blacks.500"
						width="2.5rem"
						height="2.5rem"
						borderRadius="0.25rem"
					/>
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
						Opponent Name
					</Text>
					<Grid templateColumns="repeat(8, 0fr)" gap="1rem">
						{Array.from({ length: 16 }, (_, i) => (
							<GridItem
								key={i}
								bg="brand.tertiary"
								h="3.5rem"
								w="3.5rem"
								borderRadius="0.25rem"
							/>
						))}
					</Grid>
				</Flex>

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
			</Flex>
		</Flex>
	)
}
