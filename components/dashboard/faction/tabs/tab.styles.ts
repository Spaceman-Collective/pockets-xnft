import { fonts } from "@/styles/defaultTheme";
import { Box, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const PanelContainer = styled(Box)`
  padding: 1.5rem 3rem;
  overflow: auto;
  max-height: 65rem;
`;

export const Label = styled(Text)`
  font-size: 1.25rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;
export const Value = styled(Text)`
  font-size: 1.75rem;
  font-weight: 700;
  text-transform: uppercase;
`;

export const ValueCalculation = styled(Text)`
  font-size: 1.25rem;
  font-weight: 400;
  text-transform: uppercase;
`;
