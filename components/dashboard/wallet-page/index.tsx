import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Character } from "@/types/server";
import { useSelectedCharacter } from "@/hooks/useSelectedCharacter";

export const WalletTabs: React.FC<{}> = () => {
  const [selectedCharacter, setSelectedCharacter] = useSelectedCharacter();
  return (
    <Tabs>
      <TabList mb="1em">
        <Tab>Resources</Tab>
        <Tab>Units</Tab>
        <Tab>Favors</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>res</TabPanel>
        <TabPanel>units</TabPanel>
        <TabPanel>favors</TabPanel>
      </TabPanels>
    </Tabs>
  );
};
