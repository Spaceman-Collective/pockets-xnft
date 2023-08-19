import styled from "@emotion/styled";
import { HStack, Flex, Image } from "@chakra-ui/react";
import { Tip } from "@/components/tooltip";
import { getLocalImage } from "@/lib/utils";
import { Label, Value } from "../tab.styles";
import { colors } from "@/styles/defaultTheme";
import { FC } from "react";

export const ResourceFieldAction: FC<{
  rf: { id: string; resource: string; amount: string };
}> = ({ rf }) => {
  return (
    <ResourceActionContainer key={rf.id}>
      <HStack>
        <Tip label={rf.resource}>
          <Image
            width="5rem"
            borderRadius="1rem"
            alt={rf.resource}
            src={getLocalImage({
              type: "resources",
              name: rf.resource,
            })}
          />
        </Tip>
        <Label>amount:</Label>
        <Value>{rf.amount}</Value>
      </HStack>
      <HStack>
        <Label>Harvests In:</Label>
        <Value>
          {/* {timersData?.rfTimers.find((t) => t.rf === rf.id)?.finished - Date.now() } */}
          <span style={{ fontSize: "1rem" }}>s</span>
        </Value>
      </HStack>
    </ResourceActionContainer>
  );
};

export const ResourceActionContainer = styled(Flex)`
  background-color: ${colors.blacks[500]};
  width: 100%;
  padding: 1.5rem;
  border-radius: 1rem;
  align-items: center;
  justify-content: space-between;
`;
