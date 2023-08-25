import styled from "@emotion/styled";
import {
  HStack,
  Flex,
  Image,
  Button,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { Tip } from "@/components/tooltip";
import { getLocalImage, timeAgo } from "@/lib/utils";
import { Label, Value } from "../tab.styles";
import { colors } from "@/styles/defaultTheme";
import { FC, useEffect } from "react";
import { useCountdown } from "usehooks-ts";
import { useRfHarvest } from "@/hooks/useRf";
import { useSolana } from "@/hooks/useSolana";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { FaClock } from "react-icons/fa";

export const ResourceFieldAction: FC<{
  charMint?: string;
  rf: { id: string; resource: string; amount: string };
  timer?: {
    character: string;
    finished: string;
    id: string;
    rf: string;
  };
}> = ({ rf, timer, charMint }) => {
  // show harvest button on timer undefined
  const finishedDate = timer?.finished && +timer?.finished;
  const finishedTime = typeof finishedDate === "number" ? finishedDate : 0;

  const remainingTime = (finishedTime - Date.now()) / 1000;
  const isFuture = remainingTime > 0;
  const isHarvestable = !isFuture || timer === undefined;

  const {
    buildMemoIx,
    encodeTransaction,
    walletAddress,
    connection,
    signTransaction,
  } = useSolana();
  const { mutate } = useRfHarvest();
  const queryClient = useQueryClient();

  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: isFuture ? Math.floor(remainingTime) + 1 : 10,
      intervalMs: 1000,
    });

  useEffect(() => {
    if (!isHarvestable) return;
    startCountdown();
  }, []);

  useEffect(() => {
    if (remainingTime < 0) return;
    resetCountdown();
    startCountdown();
  }, [remainingTime]);

  const post = async () => {
    if (!charMint) {
      return toast.error("no selected character:" + charMint);
    }
    if (!rf.id) {
      return toast.error("no selected resource field" + rf?.id);
    }

    const payload = {
      mint: charMint,
      timestamp: Date.now().toString(),
      rfs: [rf?.id],
    };
    const ix = buildMemoIx({
      walletAddress: walletAddress ?? "",
      payload,
    });
    let encodedTx;
    try {
      encodedTx = await encodeTransaction({
        walletAddress,
        connection,
        signTransaction,
        txInstructions: [ix],
      });
    } catch (err) {
      return toast.error("Wallet Action Failed:" + JSON.stringify(err));
    }

    if (typeof encodedTx !== "string" || encodedTx === undefined) {
      return toast.error("no encoded tx");
    }

    mutate(
      { signedTx: encodedTx },
      {
        onSuccess: (e) => {
          toast.success("Successful harvest. Check your wallet page.");
          queryClient.refetchQueries({
            queryKey: ["char-timers"],
          });
        },

        onError: (e) => {
          toast.error(JSON.stringify(e));
        },
      },
    );
  };

  return (
    <ResourceActionContainer key={rf.id}>
      <HStack>
        <Tip label={rf.resource}>
          <Image
            width="5rem"
            borderRadius="0.5rem"
            alt={rf.resource}
            src={getLocalImage({
              type: "resources",
              name: rf.resource,
            })}
          />
        </Tip>
        <VStack alignItems="start">
          <Label>amount:</Label>
          <Value>{rf.amount}</Value>
        </VStack>
      </HStack>
      <HStack gap="1rem">
        {isFuture && <Value>{timeAgo(count)}</Value>}
        {isHarvestable && (
          <Button
            bg="brand.quaternary"
            color="brand.secondary"
            fontSize="1.25rem"
            onClick={post}
          >
            Harvest
          </Button>
        )}
        {!isHarvestable && (
          <Tip label="Coming soon! Speed up with BONK">
            <IconButton
              icon={<FaClock />}
              aria-label="Speed up"
              bg={colors.blacks[400]}
              w="3rem" // Adjust the width as needed
              h="3rem" // Adjust the height as needed
              isDisabled={true}
            />
          </Tip>
        )}
      </HStack>
    </ResourceActionContainer>
  );
};

export const ResourceActionContainer = styled(Flex)`
  background-color: ${colors.blacks[500]};
  width: 100%;
  padding: 1.5rem;
  border-radius: 1rem;
  align-items: center;
  justify-content: space-between;
`;
