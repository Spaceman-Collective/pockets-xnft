import Link from "next/link";
import { Text, Button, Flex, Spinner } from "@chakra-ui/react";
import { colors } from "@/styles/defaultTheme";
import { MdLeaderboard, MdNotificationsActive } from "react-icons/md";
import { AiFillGold } from "react-icons/ai";
import { useAllFactions } from "@/hooks/useAllFactions";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useSolana } from "@/hooks/useSolana";
import { formatBalance } from "@/lib/utils";
import { useRouter } from "next/router";
import { Tip } from "../tooltip";
import { SERVER_KEY } from "@/constants";
import { usePrizePool } from "@/hooks/useWalletAssets";

export const DashboardInfo = () => {
  const { data: currentFs } = useAllFactions();
  // const numOfFactions = currentFs?.total;
  const { walletAddress, connection, getBonkBalance } = useSolana();
  const [bonkBalance, setBonkBalance] = useState<string>();
  const router = useRouter();

  const { data: prizePool, isLoading, setIsLoading } = usePrizePool();

  useEffect(() => {
    (async () => {
      if (walletAddress && connection) {
        setIsLoading(true);
        let balance = await getBonkBalance({ walletAddress, connection });
        const wholeBalance = Math.floor(balance);

        setBonkBalance(formatBalance(wholeBalance));
        setIsLoading(false);
      }
    })();
  }, [walletAddress, connection]);

  return (
    <Flex justifyContent="space-between">
      <TextContainer>
        <Label>BONK:</Label>
        <Value>
          {isLoading && <Spinner />}
          {bonkBalance}
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
      <TextContainer>
        <Label>PRIZE POOL:</Label>
        <Value>
          {isLoading && <Spinner />}
          {prizePool}
        </Value>
      </TextContainer>
      <Flex gap="2rem">
        {/* <Tip label="Coming soon">
          <IconButton
            onClick={() => {
              // Handle the click event for the first icon
            }}
          >
            <AiFillGold size={24} color={colors.brand.secondary} />
          </IconButton>
        </Tip> */}
        <Tip label="Leaderboard">
          <IconButton
            onClick={() => {
              // Handle the click event for the second icon
            }}
          >
            <MdLeaderboard
              size={24}
              color={
                router.pathname === "/leaderboard"
                  ? colors.brand.quaternary
                  : colors.brand.secondary
              }
              onClick={() => router.push("/leaderboard")}
            />
          </IconButton>
        </Tip>
        {/* 
        <Tip label="Coming soon">
          <IconButton
            onClick={() => {
              // Handle the click event for the third icon
            }}
          >
            <MdNotificationsActive size={24} color={colors.brand.secondary} />
          </IconButton>
        </Tip> */}
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
