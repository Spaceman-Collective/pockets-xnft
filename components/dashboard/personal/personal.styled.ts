import { Text } from "@chakra-ui/react"
import styled from "@emotion/styled"

export const Label = styled(Text)`
	cursor: pointer;
	font-size: 1.25rem;
	font-weight: 400;
	text-transform: uppercase;
	letter-spacing: 0.6px;
	transition: all 0.25s ease-in-out;
	:hover {
		transform: scale(1.1);
	}
`
export const Value = styled(Text)`
	font-size: 1.75rem;
	font-weight: 700;
	text-transform: uppercase;
`
