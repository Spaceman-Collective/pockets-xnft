import Confetti from "@/components/Confetti";
import { timeout } from "@/lib/utils";
import { Character } from "@/types/server";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useState } from "react";

interface TabItem {
  tabName: string;
  Component: React.FC<any>;
  componentProps?: Record<string, any>;
}

interface PageTabsProps {
  tabItems: TabItem[];
  onTabSelect?: (tabIndex: number) => void;
}

export const PageTabs: React.FC<PageTabsProps> = ({
  tabItems,
  onTabSelect,
}) => {
  const [confetti, setConfetti] = useState(false);
  const fireConfetti = async () => {
    if (confetti) return;
    setConfetti(true);
    await timeout(3600);
    setConfetti(false);
  };

  return (
    <>
      <Tabs onChange={onTabSelect}>
        <TabList mb="1em">
          {tabItems.map((item, index) => (
            <Tab key={index}>{item.tabName}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {tabItems.map((item, index) => {
            const { Component, componentProps } = item;
            return (
              <TabPanel key={index}>
                <Component {...componentProps} fire={fireConfetti} />
              </TabPanel>
            );
          })}
        </TabPanels>
        {confetti && <Confetti canFire={fireConfetti} />}
      </Tabs>
    </>
  );
};
