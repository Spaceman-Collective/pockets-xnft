import { PageTabs } from "@/components/nav"
import { useFaction } from "@/hooks/useFaction"
import { Character } from "@/types/server"
import { useDisclosure } from "@chakra-ui/react"
import { FactionTabPolitics } from "./politics-tab"
import { CitizenModal } from "./politics-tab/citizens-modal.component"
import { FactionTabResources } from "./resources-tab"
import { FactionTabServices } from "./services-tab"

export const FactionTabs: React.FC<{
  currentCharacter: Character
  setFactionStatus: (value: boolean) => void
}> = ({ currentCharacter, setFactionStatus }) => {
  const citizenDisclosure = useDisclosure()
  const factionId = currentCharacter?.faction?.id ?? ""
  const { data: factionData } = useFaction({ factionId })

  return (
    <>
      {factionData?.citizens && (
        <CitizenModal {...citizenDisclosure} citizens={factionData.citizens} />
      )}
      <PageTabs
        tabItems={[
          {
            tabName: "Services",
            Component: FactionTabServices,
            componentProps: {
              currentCharacter: currentCharacter,
              openCitizenModal: citizenDisclosure.onOpen,
            },
          },
          {
            tabName: "Politics",
            Component: FactionTabPolitics,
            componentProps: {
              currentCharacter: currentCharacter,
              setFactionStatus: setFactionStatus,
              openCitizenModal: citizenDisclosure.onOpen,
            },
          },
          {
            tabName: "Resources",
            Component: FactionTabResources,
            componentProps: {
              currentCharacter: currentCharacter,
              setFactionStatus: setFactionStatus,
            },
          },
        ]}
      />
    </>
  )
}
