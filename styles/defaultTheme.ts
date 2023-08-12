import { extendBaseTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";
import { Button } from "@/styles/brand-components";

export const colors = {
  brand: {
    primary: "#222",
    secondary: "#F8F8F8",
    tertiary: "#B1B7BF",
    quternary: "#DDCEBE",
  },
  blacks: {
    500: "#222",
    700: "#0D0D0D",
  },
};

export const fonts = {
  header: "var(--header )",
  body: "var(--body )",
};

// NOTE: To avoid large initial JS Payload, only import the components used.
const { Spinner } = chakraTheme.components;

export const defaultTheme = extendBaseTheme({
  components: {
    Button,
    Spinner,
  },
  colors,
  fonts,
});
