import { PageTabs, PageTabsEmptyState as EmptyState } from "@/components/nav"
import { Character, Faction } from "@/types/server"
import { ArenaTab } from "./arena-tab"
import { SkillsTab } from "./skills-tab"
import { EquipmentTab } from "./equipment-tab"

export const CharacterTabs: React.FC<{
	currentCharacter: Character
	allFactions: Faction[] | undefined
	selectSkill: (skill: string) => void
}> = ({ currentCharacter, selectSkill, allFactions }) => {
	if (!currentCharacter) return <EmptyState />

	return (
		<>
			<PageTabs
				tabItems={[
					{
						tabName: "Skills",
						Component: SkillsTab,
						componentProps: { currentCharacter, selectSkill },
					},
					{
						tabName: "Arena",
						Component: ArenaTab,
						componentProps: { currentCharacter, allFactions },
					},
					{
						tabName: "Equipment",
						Component: EquipmentTab,
						componentProps: { currentCharacter },
					},
				]}
			/>
		</>
	)
}
