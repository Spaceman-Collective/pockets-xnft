import { Flex, Text, Switch } from "@chakra-ui/react";
import { BiFemaleSign, BiMaleSign } from "react-icons/bi";
import styled from "@emotion/styled";

export const GenderToggleContainer = ({
  isMale,
  setIsMale,
}: {
  isMale: boolean;
  setIsMale: (bool: boolean) => void;
}) => {
  return (
    <>
      <Flex justifyContent="center" alignItems="center" gap="2rem">
        <Text>Female</Text>
        <BiFemaleSign
          style={{
            transform: isMale ? "scale(1)" : "scale(1.4)",
          }}
        />
        <GenderToggle
          size="lg"
          isChecked={isMale}
          bg={isMale ? "skyblue" : "pink"}
          onChange={(e) => setIsMale(e.target.checked)}
        />
        <BiMaleSign
          style={{
            transform: !isMale ? "scale(1)" : "scale(1.4)",
          }}
        />
        <Text>Male</Text>
      </Flex>
    </>
  );
};

const GenderToggle = styled(Switch)`
  background-color: transparent;
  span {
    --switch-bg: ${(props) => props.bg} !important;
  }
`;
