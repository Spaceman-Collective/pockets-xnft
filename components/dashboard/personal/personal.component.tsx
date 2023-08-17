import { Box, Text } from "@chakra-ui/react";
import { getLadImageURL } from "@/lib/apiClient";
import { colors } from "@/styles/defaultTheme";
import styled from "@emotion/styled";



export const Personal = () => {
  return (
    <Box
    >
      <Text
        opacity="0.7"
        top="0.2rem"
        bg="brand.primary"
        borderRadius="0.5rem"
        p="0.25rem"
        fontSize="1.25rem"
        fontWeight={700}
        letterSpacing="1px"
        zIndex={10}
      >
        FAVORS
      </Text>
      <Text
        opacity="0.7"
        top="0.2rem"
        bg="brand.primary"
        borderRadius="0.5rem"
        p="0.25rem"
        fontSize="1.25rem"
        fontWeight={700}
        letterSpacing="1px"
        zIndex={10}
      >
        MY RESOURCES
      </Text>
    </Box>
  );
};