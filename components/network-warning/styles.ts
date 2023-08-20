import styled from "@emotion/styled";
import { Flex } from "@chakra-ui/react";

export const Banner = styled(Flex)`
  flex-direction: column;
  min-height: 15rem;

  align-items: center;
  justify-content: center;

  background: linear-gradient(-45deg, #ee7752, #e73c7e, #dd9724, #ff4949);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;
