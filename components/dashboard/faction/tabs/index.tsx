import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { FactionTabServices } from "./services.component";
import { FactionTabPolitics } from "./politics.component";
import { FactionTabResources } from "./resources.component";
import { Character } from "@/types/server";

export const FactionTabs: React.FC<{  currentCharacter: Character }> = ({ currentCharacter }) => {
  
  return (
    <Tabs>
      <TabList mb="1em">
        <Tab>Services</Tab>
        <Tab>Politics</Tab>
        <Tab>Resources</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <FactionTabServices currentCharacter={currentCharacter} />
        </TabPanel>
        <TabPanel>
        <FactionTabPolitics currentCharacter={currentCharacter} />
        </TabPanel>
        <TabPanel>
          <FactionTabResources currentCharacter={currentCharacter}  />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
