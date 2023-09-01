import {
	Button,
	Icon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
} from "@chakra-ui/react"
import { colors } from "@/styles/defaultTheme"
import { FaFilter } from "react-icons/fa"
import { FC } from "react"

export const SortButton: FC<{ handleFilter: (_: string) => void }> = ({
	handleFilter,
}) => {
	return (
		<Menu>
			<MenuButton
				bg="transparent"
				_hover={{
					bg: "transparent",
					color: colors.brand.tertiary,
				}}
				as={Button}
				leftIcon={<Icon as={FaFilter} />}
			>
				SORT
			</MenuButton>
			<MenuList bg={colors.blacks[700]} border="none">
				<MenuItem
					bg={colors.blacks[700]}
					_hover={{ bg: colors.blacks[500] }}
					onClick={() => handleFilter("favor")}
				>
					Favor
				</MenuItem>
				<MenuItem
					bg={colors.blacks[700]}
					_hover={{ bg: colors.blacks[500] }}
					onClick={() => handleFilter("domWins")}
				>
					Dom Wins
				</MenuItem>
				<MenuItem
					bg={colors.blacks[700]}
					_hover={{ bg: colors.blacks[500] }}
					onClick={() => handleFilter("wealth")}
				>
					Wealth
				</MenuItem>
				<MenuItem
					bg={colors.blacks[700]}
					_hover={{ bg: colors.blacks[500] }}
					onClick={() => handleFilter("knowledge")}
				>
					Knowledge
				</MenuItem>
			</MenuList>
		</Menu>
	)
}
