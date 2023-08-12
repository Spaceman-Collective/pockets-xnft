import { Box, Button, Flex } from "@chakra-ui/react";
import { FC } from "react";
import Image from "next/image";
import { getLadImageURL } from "@/lib/apiClient";

export const CharGen: FC<{ back: () => void; next: () => void }> = ({
  next: nextStep,
  back: backStep,
}) => {
  return (
    <>
      <Flex direction="column" justifyContent="space-between" minH="60vh">
        <Box>
          <Image width="200" height="200" alt="lad" src={getLadImageURL(10)} />
        </Box>
        <Flex gap="2rem">
          <Button variant="outline" w="100%" alignSelf="end" onClick={backStep}>
            Back
          </Button>
          <Button w="100%" alignSelf="end" onClick={nextStep}>
            Continue
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

// https://www.madlads.com/_next/image?url=https%3A%2F%2Fmadlads.s3.us-west-2.amazonaws.com%2Fimages%2F22.png&w=640&q=75
