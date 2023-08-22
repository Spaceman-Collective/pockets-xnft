import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";
import { ResourceGridContainer } from "../faction/resources-grid.component";
import { useAllWalletAssets } from "@/hooks/useWalletAssets";
import { WalletUnitPanel } from "./wallet-units.component";
import { WalletFavorPanel } from "./wallet-favor.component";

export const WalletTabs: React.FC<{}> = () => {
  const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter();
  const { data: walletAssets, isLoading: walletAssetsIsLoading } =
    useAllWalletAssets();
  return (
    <Tabs>
      <TabList mb="1em">
        <Tab>Resources</Tab>
        <Tab>Units</Tab>
        <Tab>Favors</Tab>
      </TabList>
      <TabPanels p="4rem">
        <TabPanel>
          <ResourceGridContainer
            isLoading={walletAssetsIsLoading}
            resources={walletAssets?.resources}
          />
        </TabPanel>
        <TabPanel>
          <WalletUnitPanel />
        </TabPanel>
        <TabPanel>
          <WalletFavorPanel />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
