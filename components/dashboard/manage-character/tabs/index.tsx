import { PageTabs } from "@/components/nav/page-tabs"
import { Character } from "@/types/server"
import { ArenaTab } from "./arena-tab"
import { SkillsTab } from "./skills-tab"
import { FavorsTab } from "./favors-tab"

export const CharacterTabs: React.FC<{
  currentCharacter: Character
  selectSkill: (skill: string) => void
}> = ({ currentCharacter, selectSkill }) => {
  return (
    <>
      <PageTabs
        tabItems={[
          {
            tabName: "Skills",
            Component: SkillsTab,
            componentProps: {
              currentCharacter: currentCharacter,
              selectSkill: selectSkill,
            },
          },
          {
            tabName: "Arena",
            Component: ArenaTab,
            componentProps: {
              currentCharacter: currentCharacter,
            },
          },
          {
            tabName: "Favors",
            Component: FavorsTab,
            componentProps: {
              currentCharacter: currentCharacter,
            },
          },
        ]}
      />
    </>
  )
}
