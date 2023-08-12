import { colors } from "@/styles/defaultTheme";
import { ReactNode } from "react";
import styled from "@emotion/styled";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Container>{children}</Container>
    </>
  );
};

const Container = styled.div`
  background-color: ${colors.brand.primary};
`;
