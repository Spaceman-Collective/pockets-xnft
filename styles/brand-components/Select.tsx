import { defineStyleConfig } from "@chakra-ui/react";

export const selectConfig = defineStyleConfig({
  baseStyle: {
    field: {
      fontWeight: "800",
      fontSize: "16px",
      fontFamily: "body",
      borderRadius: "4px",
      padding: "1rem",
      backgroundColor: "#151414", 
      transition: "all 0.25s ease-in-out",
      width: "100%",
      height: "5rem",
      color: "brand.secondary",
      letterSpacing: "1px", 
      cursor: "pointer"
    },
    icon: {
      color: "transparent",
    },
  },
  sizes: {
    sm: {
      fontSize: "md",
      height: "4rem",
    },
    md: {
      fontSize: "14px",
      height: "5rem",
    },
  },
  variants: {
    outline: {
      _hover: {
        color: "brand.quaternary",
        borderColor: "brand.quaternary",
      },
    },
    solid: {
      _hover: {
        bg: "#151414",
      },
    },
  },
  defaultProps: {
    size: "md",
    variant: "solid",
  },
});
