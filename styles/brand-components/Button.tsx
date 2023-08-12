import { defineStyleConfig } from "@chakra-ui/react";

export const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: "700",
    fontSize: "18px",
    textTransform: "uppercase",
    letterSpacing: "0.1rem",
    fontFamily: "body",
    borderRadius: "4px",
    transition: "all 0.25s ease-in-out",
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "md",
      px: 4,
      py: 3,
    },
    md: {
      fontSize: "14px",
      px: 6,
      py: 4,
    },
  },
  variants: {
    outline: {
      border: "2px solid",
      borderColor: "brand.secondary",
      color: "brand.secondary",
      _hover: {
        border: "3px solid",
      },
    },
    solid: {
      bg: "blacks.700",
      color: "brand.secondary",
      _hover: {
        bg: "blacks.600",
      },
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "solid",
  },
});
