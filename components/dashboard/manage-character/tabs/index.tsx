import { PageTabs } from "@/components/nav/page-tabs"
import { useFaction } from "@/hooks/useFaction"
import { Character } from "@/types/server"
import { useDisclosure } from "@chakra-ui/react"
import { BattlesTab } from "./battles-tab"
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
            tabName: "Battles",
            Component: BattlesTab,
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
