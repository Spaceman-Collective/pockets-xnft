import { extendBaseTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";

export const colors = {
  brand: {
    primary: "#222",
    secondary: "#F8F8F8",
    tertiary: "#B1B7BF",
    quternary: "#DDCEBE",
  },
};

export const fonts = {
  header: "var(--header )",
  body: "var(--body )",
};

// NOTE: To avoid large initial JS Payload, only import the components used.
const { Button, Spinner } = chakraTheme.components;

export const defaultTheme = extendBaseTheme({
  components: {
    Button,
    Spinner,
  },
  colors,
  fonts,
});
