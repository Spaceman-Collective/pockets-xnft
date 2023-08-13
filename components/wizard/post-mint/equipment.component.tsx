import { Box, Grid, Text } from "@chakra-ui/react";
import { EquipItem as Equip, EquipmentContainer } from "./equip.styles";
import { colors } from "@/styles/defaultTheme";

export const Equipment = () => {
  return (
    <EquipmentContainer>
      <Equip gridArea="head" filled="true">
        <Item url="https://picsum.photos/seed/head/300" />
      </Equip>
      <Equip gridArea="torso" filled="true">
        <Item url="https://picsum.photos/seed/torso/300" />
      </Equip>
      <Equip gridArea="feet">
        <Text p="1rem">Feet</Text>
      </Equip>
      <Equip gridArea="mainhand">
        <Text p="1rem">Main hand</Text>
      </Equip>
      <Equip gridArea="offhand">
        <Text p="1rem">Off hand</Text>
      </Equip>
      <Equip gridArea="trinket" filled="true">
        <TrinketItem url="https://picsum.photos/seed/trinket/300" />
      </Equip>
    </EquipmentContainer>
  );
};

const Item = ({ url }: { url: string }) => {
  return (
    <Box m="0 auto" bgImg={url} w="100%" h="100%" bgPos="end" bgSize="cover" />
  );
};

const TrinketItem = ({ url }: { url?: string }) => {
  return (
    <Grid placeItems="center" w="100%" h="100%">
      <svg
        viewBox="0 0 120 100"
        style={{
          height: "90%",
          width: "auto",
        }}
      >
        <defs>
          <pattern
            id="img1"
            patternUnits="userSpaceOnUse"
            width="120"
            height="120"
          >
            <image href={url} x="0" y="0" width="120" height="120" />
          </pattern>
        </defs>
        <path
          style={{
            // stroke: colors.brand.secondary,
            fill: url ? `url(#img1)` : colors.brand.primary,
          }}
          d="M38,2 
           L82,2 
           A12,12 0 0,1 94,10 
           L112,44 
           A12,12 0 0,1 112,56
           L94,90       
           A12,12 0 0,1 82,98
           L38,98
           A12,12 0 0,1 26,90
           L8,56
           A12,12 0 0,1 8,44
           L26,10
           A12,12 0 0,1 38,2"
        />
      </svg>
    </Grid>
  );
};
