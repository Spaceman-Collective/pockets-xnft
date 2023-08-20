import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Character } from "@/types/server";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";
import { ResourceGridContainer } from "../faction/resources-grid.component";
import { useAllWalletAssets } from "@/hooks/useWalletAssets";

export const WalletTabs: React.FC<{}> = () => {
  const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter();
  const { data: walletAssets, isLoading: walletAssetsIsLoading } =
    useAllWalletAssets();
  console.log({ walletAssets });
  return (
    <Tabs>
      <TabList mb="1em">
        <Tab>Resources</Tab>
        <Tab>Units</Tab>
        <Tab>Favors</Tab>
      </TabList>
      <TabPanels p="3rem">
        <TabPanel>
          <ResourceGridContainer
            isLoading={walletAssetsIsLoading}
            resources={walletAssets?.resources}
          />
        </TabPanel>
        <TabPanel>units</TabPanel>
        <TabPanel>favors</TabPanel>
      </TabPanels>
    </Tabs>
  );
};
