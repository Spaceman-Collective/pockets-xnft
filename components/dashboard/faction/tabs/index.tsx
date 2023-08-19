import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { FactionTabServices } from "./services-tab";
import { FactionTabPolitics } from "./politics.component";
import { FactionTabResources } from "./resources.component";
import { Character } from "@/types/server";
import Confetti from "@/components/Confetti";
import { useState } from "react";
import { timeout } from "@/lib/utils";

export const FactionTabs: React.FC<{
  currentCharacter: Character;
  setFactionStatus: (value: boolean) => void;
}> = ({ currentCharacter, setFactionStatus }) => {
  const [confetti, setConfetti] = useState(false);
  const fireConfetti = async () => {
    if (confetti) return;
    setConfetti(true);
    await timeout(3600);
    setConfetti(false);
  };

  return (
    <Tabs>
      <TabList mb="1em" >
        <Tab>Services</Tab>
        <Tab>Politics</Tab>
        <Tab>Resources</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <FactionTabServices
            currentCharacter={currentCharacter}
            setFactionStatus={setFactionStatus!}
          />
        </TabPanel>
        <TabPanel>
        <FactionTabPolitics currentCharacter={currentCharacter} setFactionStatus={setFactionStatus!} fire={fireConfetti}/>
        </TabPanel>
        <TabPanel>
          <FactionTabResources
            currentCharacter={currentCharacter}
            setFactionStatus={setFactionStatus!}
          />
        </TabPanel>
      </TabPanels>
      {confetti && <Confetti canFire={fireConfetti} />}
    </Tabs>
  );
};
