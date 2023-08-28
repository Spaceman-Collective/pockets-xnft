import { PageTabs } from "@/components/nav"
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter"
import { useAllWalletAssets } from "@/hooks/useWalletAssets"
import { ResourceGridContainer } from "../faction/resources-grid.component"
import { WalletUnitPanel } from "./wallet-units.component"

export const WalletTabs: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter()
  const { data: walletAssets, isLoading: walletAssetsIsLoading } =
    useAllWalletAssets()
  return (
    <PageTabs
      tabPanelStyles={{ p: "4rem" }}
      tabItems={[
        {
          tabName: "Resources",
          Component: ResourceGridContainer,
          componentProps: {
            isLoading: walletAssetsIsLoading,
            resources: walletAssets?.resources,
          },
        },
        {
          tabName: "Units",
          Component: WalletUnitPanel,
          componentProps: {
            isLoading: walletAssetsIsLoading,
            units: walletAssets?.units,
          },
        },
      ]}
    />
  )
}
