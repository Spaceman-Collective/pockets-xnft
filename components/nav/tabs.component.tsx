import Confetti from "@/components/Confetti"
import { timeout } from "@/lib/utils"
import {
	Flex,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react"
import { FC, useState } from "react"

interface TabItem {
	tabName: string
	Component: React.FC<any>
	componentProps?: Record<string, any>
}

interface PageTabsProps {
	tabItems: TabItem[]
	onTabSelect?: (tabIndex: number) => void
	tabPanelStyles?: Record<string, any>
}

export const PageTabs: React.FC<PageTabsProps> = ({
	tabItems,
	onTabSelect,
	tabPanelStyles,
}) => {
	const [confetti, setConfetti] = useState(false)
	const fireConfetti = async () => {
		if (confetti) return
		setConfetti(true)
		await timeout(3600)
		setConfetti(false)
	}

	return (
		<>
			<Tabs onChange={onTabSelect}>
				<TabList mb="1em">
					{tabItems.map((item, index) => (
						<Tab key={index}>{item.tabName}</Tab>
					))}
				</TabList>
				<TabPanels {...tabPanelStyles}>
					{tabItems.map((item, index) => {
						const { Component, componentProps } = item
						return (
							<TabPanel key={index}>
								<Component {...componentProps} fire={fireConfetti} />
							</TabPanel>
						)
					})}
				</TabPanels>
				{confetti && <Confetti canFire={fireConfetti} />}
			</Tabs>
		</>
	)
}

interface MessageType {
	message: string
	subMessage: string
}

const messages: Record<string, MessageType> = {
	NoCharacterSelected: {
		message: "AW SHUCKS ANON,",
		subMessage: "SELECT A DARN CHARACTER, WILL YA?",
	},
	// ... add more types as needed
}

interface EmptyStateProps {
	type?: keyof typeof messages
}

export const PageTabsEmptyState: FC<EmptyStateProps> = ({
	type = "NoCharacterSelected",
}) => {
	const { message, subMessage } = messages[type]

	return (
		<Flex
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			gap="2rem"
			h="100%"
		>
			<Text
				textAlign="center"
				fontSize="3rem"
				fontWeight="800"
				maxWidth="50rem"
				letterSpacing="1px"
			>
				{message}
				<br /> {subMessage}
			</Text>
		</Flex>
	)
}
