// Import other components where needed, for example:
import { FC } from "react"
import { Flex, Text } from "@chakra-ui/react"
import { colors } from "@/styles/defaultTheme"

export const Header: FC<{
	title: string
	children?: React.ReactNode
}> = ({ title, children, ...props }) => {
	return (
		<Flex
			bgColor="blacks.600"
			p="2rem"
			borderRadius="0.5rem"
			justifyContent="space-between"
			alignItems="center"
			flexDirection="row"
		>
			<Text
				fontSize="1.75rem"
				lineHeight="2rem"
				fontWeight="700"
				color="brand.secondary"
				textTransform="uppercase"
			>
				{title}
			</Text>
			<Flex
				justifyContent="space-between"
				alignItems="center"
				flexDirection="row"
				color="brand.secondary"
				transition="all 0.1s ease"
				cursor="pointer"
				_hover={{
					color: colors.red[700],
				}}
			>
				{children}
			</Flex>
		</Flex>
	)
}
