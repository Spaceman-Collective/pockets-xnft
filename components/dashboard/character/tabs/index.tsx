import { MainContext } from "@/contexts/MainContext"
import { PageTabs, PageTabsEmptyState as EmptyState } from "@/components/nav"

import { ArenaTab } from "./arena-tab"
import { SkillsTab } from "./skills-tab"
import { ArmyTab } from "./army-tab"
import { useContext } from "react"

export const CharacterTabs: React.FC = () => {
	const { selectedCharacter } = useContext(MainContext)
	if (!selectedCharacter) return <EmptyState />

	return (
		<>
			<PageTabs
				tabItems={[
					{ tabName: "Skills", Component: SkillsTab },
					{ tabName: "Army", Component: ArmyTab },
					{ tabName: "Arena", Component: ArenaTab },
				]}
			/>
		</>
	)
}
