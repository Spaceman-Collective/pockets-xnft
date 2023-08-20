import {
  Flex,
  Input,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { FC, useState } from "react";

export const ConsumeButton: FC<{ isDisabled: boolean; maxValue?: number }> = ({
  isDisabled,
  maxValue,
}) => {
  const [input, setInput] = useState("");
  return (
    <Flex>
      <NumberInput
        defaultValue={1}
        min={0}
        max={maxValue}
        display={!isDisabled ? "inherit" : "none"}
      >
        <NumberInputField
          border="solid 2px rgba(0,0,0,0.25)"
          fontWeight={700}
          fontSize="1.75rem"
          w="5rem"
          color="brand.secondary"
          bg="brand.primary"
          borderRadius="1rem 0 0 1rem"
          h="100%"
        />
        <NumberInputStepper stroke="white">
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Button
        borderRadius="0 1rem 1rem 0"
        bg={!isDisabled ? "blacks.700" : "brand.primary"}
        h="fit-content"
        opacity="0.5"
        transition="all 0.25s ease-in-out"
        _hover={{ opacity: 1 }}
      >
        Consume
      </Button>
    </Flex>
  );
};

// <Input
//
//   display={!isDisabled ? "inherit" : "none"}
//   fontWeight={700}
//   w="5rem"
//   color="brand.secondary"
//   bg="blacks.600"
//   borderRadius="1rem 0 0 1rem"
//   pl="2rem"
//   onChange={(e) => setInput(e.target.value)}
// />
