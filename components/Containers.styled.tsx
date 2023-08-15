import { colors } from "@/styles/defaultTheme";
import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";

// Used in Wizard
export const CenteredBoxContainer = styled(Box)`
  margin: 0 auto;
  padding: 3rem;
  max-width: 700px;
  border-radius: 0.5rem;
  background-color: ${colors.blacks[500]};
`;

//Used in Faction + Personal
export const DashboardInfoContainer = styled(Box)`
  margin: 0 auto;
  padding: 3rem;
  width: 920px;
  border-radius: 0.5rem;
  background-color: ${colors.blacks[500]};
`;

//Used in Faction + Personal
export const DashboardMenuContainer = styled(Box)`
  margin: 3rem auto;
  padding: 3rem;
  width: 920px;
  border-radius: 0.5rem;
  background-color: ${colors.blacks[500]};
`;
