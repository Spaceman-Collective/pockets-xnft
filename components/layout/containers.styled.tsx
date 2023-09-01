import { colors } from "@/styles/defaultTheme"
import { Box } from "@chakra-ui/react"
import styled from "@emotion/styled"

export const PanelContainer = styled(Box)`
	padding: 1.5rem 3rem;
	overflow: auto;
	max-height: 65rem;
`
// Used in Wizard
export const CenteredBoxContainer = styled(Box)`
	margin: 0 auto;
	padding: 3rem;
	max-width: 700px;
	border-radius: 0.5rem;
	background-color: ${colors.blacks[500]};
`

//Used in Faction + Personal
export const DashboardContainer = styled(Box)`
	margin: 0 auto;
	width: 115rem;
	border-radius: 0.5rem;
`

//Used in Faction + Personal
export const DashboardInfoContainer = styled(Box)`
	margin: 0rem auto 0.5rem auto;
	border-radius: 0.5rem;
`

//Used in Faction + Personal
export const DashboardMenuContainer = styled(Box)`
	margin: 0rem auto 2rem auto;
	border-radius: 0.5rem;
`

export const CharacterListContainer = styled(Box)`
	margin: 0rem 1rem 0rem 0rem;
	padding: 3rem;
	width: 38rem;
	height: 72rem;
	border-radius: 0.5rem;
	background-color: ${colors.brand.primary};
`

export const SectionContainer = styled(Box)`
	margin: 0rem 0rem 0rem 1rem;
	/* padding: 3rem; */
	width: 75rem;
	height: 72rem;
	border-radius: 0.5rem;
	background-color: ${colors.brand.primary};
`
