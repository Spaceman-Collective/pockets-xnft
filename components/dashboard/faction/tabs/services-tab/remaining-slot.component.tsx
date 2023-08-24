import { getLocalImage } from "@/lib/utils";
import { Faction } from "@/types/server";
import { FC } from "react";
import { StationBox } from "./service-tab.styles";
import { Box, Spinner } from "@chakra-ui/react";
import { CheckmarkIcon } from "react-hot-toast";
import { Tip } from "@/components/tooltip";

type Construction = {
  blueprint: string;
  stationId: string;
  finishedAt: string;
  stationNewLevel: number;
};

export const RemainingSlot: FC<{
  construction?: Construction;
  slots: [number, number];
}> = ({ construction, slots: [remainingSlots, availableSlots] }) => {
  const hasConstruction = construction?.blueprint !== undefined;

  if (!hasConstruction) {
    return (
      <EmptySlot
        remainingSlots={remainingSlots}
        availableSlots={availableSlots}
      />
    );
  }

  const { blueprint, finishedAt: finished = Date.now() } = construction;
  const isFinished = +finished < Date.now();
  const img = getLocalImage({
    type: "stations",
    name: blueprint ?? "",
  });

  return (
    <StationBox
      key="underconstruction"
      backgroundImage={img}
      filter={isFinished ? "" : "saturate(0.5)"}
    >
      {!isFinished && <Spinner size="lg" m="0 auto" />}
      {isFinished && <CheckmarkIcon />}
    </StationBox>
  );
};

export const EmptySlot: FC<{
  availableSlots: string | number;
  remainingSlots: string | number;
}> = ({ availableSlots, remainingSlots }) => {
  return (
    <Tip
      label={`This slot is available for a station to be built. Townhall Level ${availableSlots}: Your faction has ${remainingSlots}/${availableSlots} remaining station slots.`}
    >
      <Box bg="brand.primary" h="7rem" w="7rem" borderRadius="1rem" />
    </Tip>
  );
};
