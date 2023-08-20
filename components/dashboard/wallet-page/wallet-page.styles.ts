import { colors } from "@/styles/defaultTheme";
import { Flex, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const FavorAction = styled(Flex)`
  background-color: ${colors.blacks[500]};
  width: 100%;
  padding: 1.5rem;
  border-radius: 1rem;
  align-items: center;
  justify-content: space-between;
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

export const MenuText = styled(Text)`
  font-size: 1.25rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1px;
`;
