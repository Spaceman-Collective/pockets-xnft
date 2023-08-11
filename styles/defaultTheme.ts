import { extendBaseTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";

// NOTE: To avoid large initial JS Payload, only import the components used.
const { Button, Spinner } = chakraTheme.components;

export const defaultTheme = extendBaseTheme({
  components: {
    Button,
    Spinner,
  },
});
