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
} from "@chakra-ui/react"
import { FC } from "react"

export const StationModalBody: FC<{ blueprint: string }> = ({ blueprint }) => {
	console.log({ blueprint })
	const station = getBlueprint(blueprint)
	const output = !!station?.unitOutput
		? station.unitOutput[0]
		: station?.resourceOutput?.[0]
	const outputImg = getLocalImage({
		type: !!station?.unitOutput ? "units" : "resources",
		name: output ?? "",
	})
	console.log({ outputImg })

	return (
		<Flex minH="400px" alignItems="center" justifyContent="center">
			<Flex
				boxSize="30rem"
				bg="blacks.700"
				borderRadius="0.5rem"
				justifyContent="space-between"
				direction="column"
			>
				<VStack>
					<Box bg="brand.quaternary" w="20rem" p="1rem">
						<Text
							fontSize="1.25rem"
							fontWeight={700}
							letterSpacing="1px"
							textTransform="uppercase"
							textAlign="center"
							pb="1rem"
						>
							Input Resources
						</Text>
						<Flex gap="1rem" alignItems="start">
							<Image src={outputImg} alt={"output" + output} boxSize="5rem" />
							<Image src={outputImg} alt={"output" + output} boxSize="5rem" />
						</Flex>
					</Box>
					<Flex gap="1rem">
						<Image src={outputImg} alt={"output" + output} boxSize="20rem" />
					</Flex>
				</VStack>
				<Progress value={50} w="100%" minH="2rem" borderRadius="0 0 1rem 1rem" />
			</Flex>
		</Flex>
	)
}
