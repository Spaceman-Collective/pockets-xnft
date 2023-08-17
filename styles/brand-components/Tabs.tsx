import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  tab: {
    width: "100%",
    padding: "1rem 0",
    fontWeight: 700,
    backgroundColor: "blacks.500",
    textTransform: "uppercase",
    _selected: {
      color: "brand.quaternary",
      backgroundColor: "brand.primary",
      borderRadius: "1rem 1rem 0 0",
    },
  },
  tabpanel: {
    // fontFamily: "mono", // change the font family
  },
});

// export the component theme
export const Tabs = defineMultiStyleConfig({ baseStyle });
