import { Box, Text } from "@chakra-ui/react";
import { getLadImageURL } from "@/lib/apiClient";
import { Image100 as Img } from "./wizard.styled";

export const Frame = ({
  img,
  select,
}: {
  img: string;
  select?: () => void;
}) => {
  if (!img) return "";
  return (
    <Box
      cursor={!!select ? "pointer" : "initial"}
      position="relative"
      transition="all 0.25s ease-in-out"
      _hover={{
        transform: !!select && "scale(1.2)",
      }}
      onClick={select}
    >
      <Img width="200" height="100" alt="lad" src={img} />
    </Box>
  );
};
export const Lad = ({ lad }: { lad: number }) => {
  return (
    <Box
      cursor="pointer"
      position="relative"
      transition="all 0.25s ease-in-out"
      _hover={{
        transform: "scale(1.2)",
      }}
    >
      <Text
        opacity="0.7"
        position="absolute"
        top="0.2rem"
        left="0.2rem"
        bg="brand.primary"
        borderRadius="1rem"
        p="0.25rem"
        fontSize="1.25rem"
        fontWeight={700}
        letterSpacing="1px"
        zIndex={10}
      >
        #{lad}
      </Text>
      <Img width="200" height="100" alt="lad" src={getLadImageURL(lad)} />
    </Box>
  );
};
