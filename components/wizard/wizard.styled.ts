import { Text, Image } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const H3 = styled(Text)`
  text-transform: uppercase;
  font-weight: 700;
  margin: 1rem 0;
`;

export const Image100 = styled(Image)`
  border-radius: 1rem;
  object-position: end;
  object-fit: cover;
  width: 100px;
  height: 100px;
`;
