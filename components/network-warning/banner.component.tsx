import styled from "@emotion/styled";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Banner } from "./styles";

export const NetworkWarningBanner = () => {
  const d =
    "background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)";
  return (
    <Banner>
      <Text>Warning! </Text>
      <Text>Your public RPC Endpoint will cause throttling</Text>
    </Banner>
  );
};
