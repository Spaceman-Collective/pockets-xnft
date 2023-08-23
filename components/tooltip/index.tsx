import { FC, ReactNode } from "react";
import { PlacementWithLogical, Tooltip, TooltipProps } from "@chakra-ui/react";

export const Tip: FC<{
  children: ReactNode;
  label: string | ReactNode;
  placement?: PlacementWithLogical;
}> = ({ label, placement = "auto", children }) => {
  return (
    <Tooltip label={label} hasArrow placement={placement}>
      {children}
    </Tooltip>
  );
};
