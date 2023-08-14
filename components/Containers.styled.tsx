import { colors } from "@/styles/defaultTheme";
import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const CenteredBoxContainer = styled(Box)`
  margin: 0 auto;
  padding: 2rem 3rem;
  max-width: 700px;
  border-radius: 0.5rem;
  background-color: ${colors.blacks[500]};
`;
