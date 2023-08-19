import chakraTheme from "@chakra-ui/theme";
import { defineStyleConfig } from "@chakra-ui/react";

const { Tooltip } = chakraTheme.components;
const { baseStyle, ...rest } = Tooltip;

const defaultProps = {
  ...rest,
  baseStyle: {
    ...baseStyle,
    size: "sm",
    fontSize: "1.25rem",
    letterSpacing: "1px",
    padding: "1rem",
    maxWidth: "20rem",
  },
};

// export the component theme
export const ToolTip = defineStyleConfig(defaultProps);
