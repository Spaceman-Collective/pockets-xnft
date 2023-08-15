import { Flex, Box, Text, Button } from "@chakra-ui/react";

export const FactionBox = () => {
  return (
    <>
      <Flex
        bg="brand.primary"
        w="100%"
        h="13rem"
        borderRadius="0.5rem"
        alignItems="center"
        justifyContent="space-between"
        p="2rem"
      >
        <Flex gap="2rem" alignItems="center">
          <Box
            bg="blacks.500"
            h="10rem"
            w="10rem"
            backgroundImage="https://picsum.photos/200"
            backgroundPosition="center"
            backgroundSize="cover"
            borderRadius="0.5rem"
          />
          <Box>
            <Text textTransform="uppercase" fontSize="1.25rem">
              population{" "}
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "2rem",
                  marginLeft: "0.5rem",
                }}
              >
                12
              </span>
            </Text>
            <Text textTransform="uppercase" fontSize="2.5rem" fontWeight={700}>
              Faction Name
            </Text>
            <Text
              color="brand.tertiary"
              letterSpacing="0.25rem"
              textTransform="uppercase"
              fontSize="1.5rem"
              textDecor="underline"
            >
              factionsite.com
            </Text>
          </Box>
        </Flex>
        <Box>
          <Button>join</Button>
        </Box>
      </Flex>
    </>
  );
};
