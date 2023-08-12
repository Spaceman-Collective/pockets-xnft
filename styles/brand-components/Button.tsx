import { defineStyleConfig } from "@chakra-ui/react";
import { colors } from "../defaultTheme";

export const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontWeight: "700",
    fontSize: "18px",
    textTransform: "uppercase",
    letterSpacing: "0.1rem",
    fontFamily: "body",
    borderRadius: "4px", // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "md",
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: "14px",
      px: 6, // <-- these values are tokens from the design system
      py: 4, // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      border: "2px solid",
      borderColor: "brand.secondary",
      color: "brand.secondary",
    },
    solid: {
      bg: "blacks.700",
      color: "brand.secondary",
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "solid",
  },
});
