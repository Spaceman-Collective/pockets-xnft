import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { FactionTabServices } from "./services-tab";
import { FactionTabPolitics } from "./politics.component";
import { FactionTabResources } from "./resources-tab";
import { Character } from "@/types/server";
import Confetti from "@/components/Confetti";
import { useState } from "react";
import { timeout } from "@/lib/utils";
import { CitizenModal } from "./citizens-modal.component";
import { useFaction } from "@/hooks/useFaction";

export const FactionTabs: React.FC<{
  currentCharacter: Character;
  setFactionStatus: (value: boolean) => void;
}> = ({ currentCharacter, setFactionStatus }) => {
  const citizenDisclosure = useDisclosure();
  const [confetti, setConfetti] = useState(false);
  const fireConfetti = async () => {
    if (confetti) return;
    setConfetti(true);
    await timeout(3600);
    setConfetti(false);
  };

  const factionId = currentCharacter?.faction?.id ?? "";
  const { data: factionData } = useFaction({ factionId });

  return (
    <>
      {factionData?.citizens && (
        <CitizenModal {...citizenDisclosure} citizens={factionData.citizens} />
      )}
      <Tabs>
        <TabList mb="1em">
          <Tab>Services</Tab>
          <Tab>Politics</Tab>
          <Tab>Resources</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FactionTabServices
              currentCharacter={currentCharacter}
              openCitizenModal={citizenDisclosure.onOpen}
            />
          </TabPanel>
          <TabPanel>
            <FactionTabPolitics
              openCitizenModal={citizenDisclosure.onOpen}
              currentCharacter={currentCharacter}
              setFactionStatus={setFactionStatus!}
              fire={fireConfetti}
            />
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
    </>
  );
};
