import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { FC, useState } from "react"
import Image from "next/image"
import styled from "@emotion/styled"
import { H3 } from "../wizard.styled"
import { RumbleInput } from "./rumble-input.component"
import { GenderToggleContainer } from "./gender-toggle.component"
import type { Character, NFT } from "@/types/server"
import { getRandomName } from "@/lib/utils"
import { useSolana } from "@/hooks/useSolana"
import { useCreateCharacter } from "@/hooks/useCreateCharacter"
import { SPL_TOKENS, FACTION_CREATION_MULTIPLIER } from "@/constants"

export const Generate: FC<{
	fire: () => void
	back: () => void
	next: () => void
	setReviewMint: (char: Character) => void
	nft: NFT
}> = ({ fire: fireConfetti, back: backStep, nft, setReviewMint }) => {
	const [isMale, setIsMale] = useState(false)
	const [name, setName] = useState<string>(getRandomName({ isMale }))
	const getNewName = () => setName(getRandomName({ isMale }))

	const { mutate } = useCreateCharacter()
	const onSuccess = (data: any) => {
		setReviewMint(data)
		fireConfetti()
	}

	const {
		connection,
		walletAddress,
		signTransaction,
		buildMemoIx,
		encodeTransaction,
	} = useSolana()

	return (
		<>
			<Flex direction="column" justifyContent="space-between" minH="60vh">
				<H3>Generate your Character</H3>
				<GenImg img={nft.cached_image_uri} name={nft.name} />
				<Box>
					<GenderToggleContainer isMale={isMale} setIsMale={setIsMale} />
					<RumbleInput name={name} shake={getNewName} />
				</Box>
				<Flex gap="2rem">
					<Button variant="outline" w="100%" alignSelf="end" onClick={backStep}>
						Back
					</Button>
					<Button
						bg="brand.quaternary"
						color="brand.secondary"
						border="2px solid"
						borderColor="brand.quaternary"
						_hover={{ bg: "brand.tertiary", borderColor: "brand.tertiary" }}
						w="100%"
						alignSelf="end"
						onClick={async () => {
							const payload = {
								mint: nft.mint,
								timestamp: Date.now().toString(),
								name,
							}

							if (!walletAddress) return console.error("no wallet")
							const encodedSignedTx = await encodeTransaction({
								walletAddress,
								connection,
								signTransaction,
								txInstructions: [buildMemoIx({ walletAddress, payload })],
							})

							if (!encodedSignedTx) {
								console.error("No Tx")
								return
							}
							mutate({ signedTx: encodedSignedTx as string }, { onSuccess })
						}}
					>
						Mint Character
					</Button>
				</Flex>
			</Flex>
		</>
	)
}

const GenImg = ({ img, name }: { img: string; name?: string }) => {
	return (
		<Box
			m="0 auto"
			cursor="pointer"
			position="relative"
			transition="all 0.25s ease-in-out"
		>
			{name && (
				<Text
					opacity="0.7"
					position="absolute"
					top="0.5rem"
					left="0.5rem"
					bg="brand.primary"
					borderRadius="1rem"
					p="0.25rem"
					fontSize="1.25rem"
					fontWeight={700}
					letterSpacing="1px"
					zIndex={10}
				>
					{name}
				</Text>
			)}
			<Img
				width="400"
				height="1"
				alt="lad"
				src={img}
				placeholder="blur"
				blurDataURL="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
			/>
		</Box>
	)
}

const Img = styled(Image)`
	border-radius: 1rem;
	object-position: end;
	object-fit: cover;
	max-height: 300px;
	width: 300px;
`
