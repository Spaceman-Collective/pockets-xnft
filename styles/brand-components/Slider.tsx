import { defineStyleConfig } from "@chakra-ui/react";

export const SliderStyles = defineStyleConfig({
    baseStyle: {
      Slider: {
        colorScheme: "black",
        thumbSize: 6,
      },
      SliderTrack: {
        backgroundColor: "#151414", 
    },
      SliderThumb: {
        boxSize: 6,
        backgroundColor: "#151414", 
        _focus: {
          boxShadow: "none",
        },
        _active: {
            backgroundColor: "#151414", 
        },
      },
      SliderFilledTrack: {
        backgroundColor: "#151414", 
    },
    },
  });
  