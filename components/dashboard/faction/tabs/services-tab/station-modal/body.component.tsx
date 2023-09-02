import { Tip } from "@/components/tooltip"
import { getLocalImage } from "@/lib/utils"
import { getBlueprint } from "@/types/server"
import {
	Grid,
	Text,
	Flex,
	Box,
	Image,
	Progress,
	VStack,
	Button,
} from "@chakra-ui/react"
import { FC } from "react"

export const StationModalBody: FC<{
	blueprint: string
	progress: number
	resourcesInWallet?: { value: string; name: string }[]
	isFuture: boolean
	isClaimable: boolean
	timer?: any
}> = ({
	blueprint,
	progress,
	resourcesInWallet,
	isFuture,
	isClaimable,
	timer,
}) => {
	const station = getBlueprint(blueprint)
	const output = !!station?.unitOutput
		? station.unitOutput[0]
		: station?.resourceOutput?.[0]
	const outputImg = getLocalImage({
		type: !!station?.unitOutput ? "units" : "resources",
		name: output ?? "",
	})

	return (
		<Flex minH="400px" alignItems="center" justifyContent="center" my="3rem">
			<Flex
				w="35rem"
				minH="30rem"
				bg="blacks.700"
				borderRadius="0.5rem"
				justifyContent="space-between"
				direction="column"
				gap="1rem"
			>
				<VStack gap="1rem">
					<Box bg="brand.quaternary" w="23rem" p="1rem" borderRadius="0 0 1rem 1rem">
						<Text
							fontSize="1.25rem"
							fontWeight={700}
							letterSpacing="1px"
							textTransform="uppercase"
							textAlign="center"
							pb="1rem"
						>
							Resources Required
						</Text>
						<Flex gap="1rem" alignItems="start">
							{station?.inputs.map((e) => (
								<ItemImg
									key={e.amount + e.resource + "input"}
									name={e.resource}
									amount={e.amount}
									inWallet={
										resourcesInWallet?.find((item) => item.name === e.resource)?.value
									}
								/>
							))}
						</Flex>
					</Box>
					{!timer && (
						<Button minW="23rem" bg="brand.primary">
							Build {output}
						</Button>
					)}
					<Image
						src={outputImg}
						alt={"output" + output}
						boxSize="23rem"
						borderRadius="1rem"
					/>
					{isClaimable && (
						<Button minW="23rem" bg="brand.primary">
							Claim {output}
						</Button>
					)}
				</VStack>
				<Progress
					value={progress}
					w="100%"
					minH="2rem"
					borderRadius="0 0 1rem 1rem"
				/>
			</Flex>
		</Flex>
	)
}

const ItemImg: FC<{
	isUnit?: boolean
	name: string
	amount: number
	inWallet?: string
}> = ({ isUnit, name, amount, inWallet }) => {
	const img = getLocalImage({ type: isUnit ? "units" : "resources", name: name })
	const hasEnough = inWallet ? +amount <= +inWallet : false
	return (
		<Tip label={`Requires ${amount}x ${name}`}>
			<Box position="relative" opacity={hasEnough ? 1 : 0.25}>
				<Text
					fontSize="1rem"
					fontWeight={700}
					color="brand.primary"
					letterSpacing="1px"
				>
					{inWallet}x
				</Text>
				<Image src={img} alt={"item" + name} boxSize="5rem" borderRadius="0.5rem" />
				<Box
					position="absolute"
					bottom="-2px"
					right="-2px"
					bg="brand.primary"
					px="0.5rem"
					borderRadius="0.25rem"
				>
					<Text fontSize="1.25rem" fontWeight={700}>
						{amount}
					</Text>
				</Box>
			</Box>
		</Tip>
	)
}
