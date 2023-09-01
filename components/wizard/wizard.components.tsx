import { Box, Text } from "@chakra-ui/react"
import { getLadImageURL, getPogImageURL } from "@/lib/apiClient"
import { Image100 as Img } from "./wizard.styled"

export const Frame = ({
	img,
	select,
	size = "100px",
}: {
	img: string
	select?: () => void
	size?: string
}) => {
	if (!img) return ""
	return (
		<Box
			cursor={!!select ? "pointer" : "initial"}
			position="relative"
			transition="all 0.25s ease-in-out"
			_hover={{
				transform: !!select && "scale(1.2)",
			}}
			onClick={select}
		>
			<Img
				width="200"
				height="100"
				style={{ height: size, width: size }}
				alt="nft"
				src={img}
				fallbackSrc="https://via.placeholder.com/100"
			/>
		</Box>
	)
}
export const Lad = ({ lad }: { lad: number }) => {
	return (
		<Box
			cursor="pointer"
			position="relative"
			transition="all 0.25s ease-in-out"
			_hover={{
				transform: "scale(1.2)",
			}}
		>
			<Text
				opacity="0.7"
				position="absolute"
				top="0.2rem"
				left="0.2rem"
				bg="brand.primary"
				borderRadius="1rem"
				p="0.25rem"
				fontSize="1.25rem"
				fontWeight={700}
				letterSpacing="1px"
				zIndex={10}
			>
				#{lad}
			</Text>
			<Img width="200" height="100" alt="lad" src={getLadImageURL(lad)} />
		</Box>
	)
}

export const Pog = ({ pog }: { pog: number }) => {
	return (
		<Box
			cursor="pointer"
			position="relative"
			transition="all 0.25s ease-in-out"
			_hover={{
				transform: "scale(1.2)",
			}}
		>
			<Text
				opacity="0.7"
				position="absolute"
				top="0.2rem"
				left="0.2rem"
				bg="brand.primary"
				borderRadius="1rem"
				p="0.25rem"
				fontSize="1.25rem"
				fontWeight={700}
				letterSpacing="1px"
				zIndex={10}
			>
				#{pog}
			</Text>
			<Img width="200" height="100" alt="lad" src={getPogImageURL(pog)} />
		</Box>
	)
}
