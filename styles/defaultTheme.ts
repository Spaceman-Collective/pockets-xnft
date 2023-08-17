import { extendBaseTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";
import { Button, Tabs } from "@/styles/brand-components";

export const colors = {
  brand: {
    primary: "#222",
    secondary: "#F8F8F8",
    tertiary: "#B1B7BF",
    quaternary: "#E7B987",
  },
  blacks: {
    500: "#1B1A1A",
    600: "#151414",
    700: "#0D0D0D",
  },
  purple: {
    700: "#6A527C",
  },
};

export const fonts = {
  header: "var(--header )",
  body: "var(--body )",
};

// NOTE: To avoid large initial JS Payload, only import the components used.
const { Spinner, Switch, Skeleton, Modal } = chakraTheme.components;

export const defaultTheme = extendBaseTheme({
  styles: {
    global: {
      body: {
        color: "brand.secondary",
        bg: "blacks.700",
        fontSize: "1.75rem",
      },
      h1: {
        fontSize: "32px",
        fontWeight: 900,
        letterSpacing: "5px",
        fontFamily: "header",
        textTransform: "uppercase",
      },
    },
  },
  components: {
    Button,
    Spinner,
    Switch,
    Skeleton,
    Modal,
    Tabs,
  },
  colors,
  fonts,
});
