import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { FactionTabServices } from "./services.component";
import { FactionTabPolitics } from "./politics.component";
import { FactionTabResources } from "./resources.component";

export const FactionTabs = () => {
  return (
    <Tabs>
      <TabList mb="1em">
        <Tab>Services</Tab>
        <Tab>Politics</Tab>
        <Tab>Resources</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <FactionTabServices />
        </TabPanel>
        <TabPanel>
          <FactionTabPolitics />
        </TabPanel>
        <TabPanel>
          <FactionTabResources />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
