import { colors } from "@/styles/defaultTheme";
import { Grid, GridItem } from "@chakra-ui/react";
import styled from "@emotion/styled";

type EquipTypes =
  | "head"
  | "torso"
  | "mainhand"
  | "offhand"
  | "trinket"
  | "feet";

export const EquipItem = styled(GridItem)<{
  gridArea?: EquipTypes;
  filled?: string;
}>`
  cursor: ${(props) => (props?.filled ? "pointer" : "")};
  background-color: ${(props) => {
    const isTrinket = props.gridArea === "trinket";
    return !isTrinket && colors.brand.primary;
  }};
  border-radius: ${(props) => {
    const isHead = props.gridArea === "head";
    return isHead ? "100%" : "0.5rem";
  }};
  overflow: hidden;

  transition: all 0.25s ease;
  :hover {
        transform: ${(props) => (props?.filled ? "scale(1.1)" : "scale(1)")}
      }
  }
`;

export const EquipmentContainer = styled(Grid)`
  margin: 0 auto;
  width: 100%;
  max-width: 250px;
  min-height: 250px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-auto-columns: 1fr;
  gap: 0.5rem;
  grid-auto-flow: row;
  grid-template-areas:
    ". head ."
    "mainhand torso offhand"
    ". feet trinket";

  .head {
    grid-area: head;
  }

  .torso {
    grid-area: torso;
  }

  .mainhand {
    grid-area: mainhand;
  }

  .offhand {
    grid-area: offhand;
  }

  .trinket {
    grid-area: trinket;
  }

  .feet {
    grid-area: feet;
  }
`;
