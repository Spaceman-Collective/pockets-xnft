import { FC, ReactNode } from "react";
import { PlacementWithLogical, Tooltip, TooltipProps } from "@chakra-ui/react";

export const Tip: FC<{
  children: ReactNode;
  label: string | ReactNode;
  placement?: PlacementWithLogical;
  isHidden?: boolean;
}> = ({ label, placement = "auto", isHidden, children }) => {
  return (
    <Tooltip
      label={label}
      hasArrow
      placement={placement}
      display={isHidden ? "none" : "block"}
    >
      {children}
    </Tooltip>
  );
};
