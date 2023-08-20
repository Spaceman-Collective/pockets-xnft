import Link from "next/link";
import { Text, Button, Flex, Spinner } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { MdLeaderboard, MdNotificationsActive } from "react-icons/md";
import { AiFillGold } from "react-icons/ai";
import { useFetchAllFactions } from "@/hooks/useFetchAllFactions";
import styled from "@emotion/styled";

export const DashboardInfo = () => {
  const { data: currentFs } = useFetchAllFactions();
  // const numOfFactions = currentFs?.total;

  return (
    <Flex justifyContent="space-between">
      <TextContainer>
        <Label>BONK:</Label>
        <Value>
          <Spinner />
        </Value>
        <Link href="https://jup.ag/swap/SOL-Bonk" target="_blank">
          <Button
            variant="outline"
            fontSize="1rem"
            py="0.5rem"
            ml="0.5rem"
            mb="0.25rem"
            opacity="0.15"
            _hover={{
              opacity: 0.6,
            }}
          >
            Buy
          </Button>
        </Link>
      </TextContainer>
      {/* <Flex gap="2rem"> */}
      {/*   <TextContainer> */}
      {/*     <Label>FACTIONS:</Label> */}
      {/*     <Value>{numOfFactions}</Value> */}
      {/*   </TextContainer> */}
      {/*   <TextContainer> */}
      {/*     <Label>TOTAL RFS:</Label> */}
      {/*     <Value>{totalRfs}</Value> */}
      {/*   </TextContainer> */}
      {/*   <TextContainer> */}
      {/*     <Label>PLAYERS:</Label> */}
      {/*     <Value>{numOfPlayers}</Value> */}
      {/*   </TextContainer> */}
      {/* </Flex> */}
      <Flex gap="2rem">
        <IconButton
          onClick={() => {
            // Handle the click event for the first icon
          }}
        >
          <AiFillGold size={24} color={colors.brand.secondary} />
        </IconButton>
        <IconButton
          onClick={() => {
            // Handle the click event for the second icon
          }}
        >
          <MdLeaderboard size={24} color={colors.brand.secondary} />
        </IconButton>
        <IconButton
          onClick={() => {
            // Handle the click event for the third icon
          }}
        >
          <MdNotificationsActive size={24} color={colors.brand.secondary} />
        </IconButton>
      </Flex>
    </Flex>
  );
};

const Label = styled(Text)`
  margin: 0 auto;
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 1px;
  color: ${colors.brand.tertiary};
`;
const Value = styled(Text)`
  border-radius: 0.5rem;
  padding: 0.25rem;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 1px;
`;
const TextContainer = styled(Flex)`
  align-items: end;
`;

const IconButton = styled(Button)`
  align-items: end;
  padding: 0.5rem;

  svg {
    transition: all 0.25s ease-in-out;
  }
  svg:hover {
    fill: ${colors.brand.quaternary};
  }
`;
