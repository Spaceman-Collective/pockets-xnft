import { Text, Button, Flex, Box, Grid } from "@chakra-ui/react";
import { Equipment } from "./equipment.component";
import styled from "@emotion/styled";

export const ReviewMint = () => {
  return (
    <Flex minH="60vh" direction="column" justifyContent="space-between">
      <Flex direction="column" gap="2rem">
        <Flex gap="1.5rem" direction={{ base: "column", md: "row" }}>
          <Equipment />
          <Flex
            w="100%"
            justifyContent="space-between"
            direction="column"
            gap={{ base: "1.5rem", md: "" }}
          >
            <Stat label="Health" value={347} />
            <Stat label="Spirit" value={134} />
            <Stat label="Weight" value={120} suffix="KG" />
            <Grid templateColumns="repeat(2, 1fr)" gap="1.5rem">
              <Stat label="Dodge" value={12} />
              <Stat label="Parry" value={13} />
              <Stat label="Magic Resist" value={8} />
              <Stat label="Armor" value={25} />
            </Grid>
          </Flex>
        </Flex>
        <Flex w="100%" justifyContent="space-between">
          <Flex gap="5rem">
            <Value>Skills</Value>
            <Flex alignItems="end" gap="1rem">
              <Label>xp:</Label>
              <Value>123/456</Value>
            </Flex>
            <Flex alignItems="end" gap="1rem">
              <Label>points:</Label>
              <Value>1004</Value>
            </Flex>
          </Flex>
          <Label>See all {">"}</Label>
        </Flex>
        <Grid templateColumns="repeat(auto-fill, minmax(75px, 1fr))" gap="1rem">
          {Array.from({ length: 10 }).map((_, i) => (
            <Box
              key={i + "skillbox"}
              p="1rem"
              w="75px"
              h="75px"
              bg="brand.primary"
              borderRadius="1rem"
              textTransform="uppercase"
              fontWeight={700}
              fontSize="1.25rem"
            >
              Skill
            </Box>
          ))}
        </Grid>
      </Flex>
      <Button>Confirm</Button>
    </Flex>
  );
};

const Stat = ({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) => {
  return (
    <Flex
      bg="brand.primary"
      p="1rem"
      borderRadius="0.5rem"
      gap="1rem"
      alignItems="end"
    >
      <Label>{label}:</Label>
      <Flex gap="0.5rem">
        <Value>{value}</Value>
        {suffix && (
          <Text letterSpacing="1px" fontWeight={600} fontSize="1.5rem">
            {suffix}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

const Label = styled(Text)`
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.5;
  font-weight: 400;
  font-size: 1.75rem;
`;

const Value = styled(Text)`
  font-weight: 700;
  font-size: 2rem;
  text-transform: uppercase;
`;
