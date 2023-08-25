import { getLocalImage, timeAgo } from "@/lib/utils";
import { FC } from "react";
import { StationBox } from "./service-tab.styles";
import { Box, Spinner } from "@chakra-ui/react";
import { CheckmarkIcon, toast } from "react-hot-toast";
import { Tip } from "@/components/tooltip";
import { useCompleteConstruction } from "@/hooks/useFaction";
import { FaHammer } from "react-icons/fa";
import styled from "@emotion/styled";

type Construction = {
  blueprint?: string;
  stationId?: string;
  finishedAt?: string;
  stationNewLevel?: number;
};

export const RemainingSlot: FC<{
  factionId?: string;
  construction?: Construction;
  slots?: [number, number];
}> = ({
  factionId,
  construction,
  slots: [remainingSlots, availableSlots] = [0, 0],
}) => {
  const hasConstruction = construction?.blueprint !== undefined;
  const { mutate, isLoading } = useCompleteConstruction();

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
  const remainingTime = isFinished ? 0 : +finished - Date.now();
  const img = getLocalImage({
    type: "stations",
    name: blueprint ?? "",
  });

  const onClick = () => {
    if (!isFinished || !factionId) return;
    mutate(
      { factionId },
      {
        onSuccess: (_) => {
          toast.success(construction?.blueprint + " created");
        },
        onError: (_) => {
          toast.error("Oops! Did not create a station");
        },
      },
    );
  };

  return (
    <Tip
      label={
        isFinished
          ? "Station ready! Click to continue"
          : `Remaining Build Time: ${timeAgo(remainingTime / 1000)} `
      }
    >
      <StationBox
        key="underconstruction"
        onClick={onClick}
        backgroundImage={img}
        filter={isFinished ? "" : "saturate(0.5)"}
      >
        {isLoading && <Spinner size="lg" m="0 auto" />}
        {!isLoading && isFinished && <CheckmarkIcon />}
        {!isLoading && !isFinished && <AnimatedHammer />}
      </StationBox>
    </Tip>
  );
};

export const EmptySlot: FC<{
  availableSlots: string | number;
  remainingSlots: string | number;
}> = ({ availableSlots, remainingSlots }) => {
  return (
    <Tip
      label={`This slot is available for a station to be built. Townhall Level ${availableSlots}: allows for a total of ${availableSlots} stations. You have ${remainingSlots} available slot${
        +remainingSlots > 1 ? "s" : ""
      } left. Create a proposal in the politics tab to start one.`}
    >
      <Box bg="brand.primary" h="7rem" w="7rem" borderRadius="1rem" />
    </Tip>
  );
};

const AnimatedHammer = styled(FaHammer)`
  filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 1));
  animation: pulse 5s ease-in-out infinite;

  svg {
    stroke: black;
    stroke-width: 2px;
  }
  @keyframes pulse {
    from {
      transform: scale(1);
    }
    50% {
      transform: scale(2);
    }
    to {
      transform: scale(1);
    }
  }
`;
