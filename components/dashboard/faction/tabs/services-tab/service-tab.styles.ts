import { Flex, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";

const stationSize = "7rem";

export const StationBox = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 100%;
  height: 100%;
  min-height: ${stationSize};
  min-width: ${stationSize};
  border-radius: 1rem;
  background-size: cover;
  background-position: center;
  transition: all 0.25s ease-in-out;

  :hover {
    transform: scale(1.2);
  }
`;

export const Title = styled(Text)`
  text-transform: uppercase;
  font-size: 3rem;
  font-weight: 700;
`;
