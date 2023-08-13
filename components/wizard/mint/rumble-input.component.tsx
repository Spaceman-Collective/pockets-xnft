import { colors } from "@/styles/defaultTheme";
import { Flex, Text } from "@chakra-ui/react";
import { FaDice } from "react-icons/fa";
import styled from "@emotion/styled";
import { FC, useState } from "react";
import { timeout } from "@/lib/utils";

export const RumbleInput: FC<{ name: string; shake: () => void }> = ({
  name,
  shake,
}) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const press = async () => {
    setIsPressed(true);

    await timeout(100);
    shake();
    await timeout(500);
    setIsPressed(false);
  };
  return (
    <Wrapper
      pressed={isPressed ? isPressed.toString() : undefined}
      onClick={press}
    >
      <Text>{name}</Text>
      <FaDice color={colors.brand.primary} fontSize="4rem" />
    </Wrapper>
  );
};

const Wrapper = styled(Flex)<{ pressed?: string }>`
  justify-content: space-between;
  align-items: center;

  background-color: ${colors.brand.secondary};
  color: ${colors.brand.primary};
  padding: 1rem;
  border-radius: 0.5rem;
  max-width: 300px;
  width: 100%;
  margin: 2rem auto;
  cursor: pointer;

  animation: ${(props) => {
    return props.pressed ? "spinX 600ms infinite ease-in-out" : "";
  }};

  svg {
    transition: all 0.25s ease-in-out;
  }

  :hover {
    svg {
      transform: ${(props) => {
        return props.pressed ? "scale(1)" : "scale(1.2)";
      }};
    }
  }

  @keyframes spinX {
    from {
      transform: rotate3d(1, 0, 0, 0deg);
    }
    70% {
      transform: rotate3d(1, 0, 0, 420deg);
    }
    to {
      transform: rotate3d(1, 0, 0, 360deg);
    }
  }
`;
