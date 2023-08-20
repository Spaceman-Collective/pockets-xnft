import {
  Flex,
  Input,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Fade,
} from "@chakra-ui/react";
import { FC, useState } from "react";

export const ConsumeButton: FC<{
  isDisabled: boolean;
  maxValue?: number;
  onClick: (amountToBurn: number) => void;
}> = ({ isDisabled, maxValue, onClick }) => {
  const [input, setInput] = useState(0);
  const [focused, setFocused] = useState(false);
  console.log({ input });
  return (
    <>
      <Flex>
        <NumberInput
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          defaultValue={1}
          min={0}
          max={maxValue}
          display={!isDisabled ? "inherit" : "none"}
          value={input}
          onChange={(e) => setInput(Number(e))}
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
            <NumberIncrementStepper
              bg="blacks.600"
              border="none"
              _hover={{ bg: "green.700" }}
            />
            <NumberDecrementStepper
              bg="blacks.600"
              border="none"
              _hover={{ bg: "red.700" }}
            />
          </NumberInputStepper>
        </NumberInput>
        <Button
          borderRadius="0 1rem 1rem 0"
          bg={!isDisabled ? "blacks.700" : "brand.primary"}
          h="fit-content"
          opacity="0.5"
          transition="all 0.25s ease-in-out"
          _hover={{ opacity: 1 }}
          onClick={() => {
            onClick(input);
          }}
        >
          Consume
        </Button>
      </Flex>
      {focused && (
        <Slider
          focusThumbOnChange={false}
          value={input}
          onChange={setInput}
          min={0}
          max={maxValue}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb
            fontWeight={700}
            fontSize="1.5rem"
            boxSize="3rem"
            bg="blacks.700"
          >
            {input}
          </SliderThumb>
        </Slider>
      )}
    </>
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
