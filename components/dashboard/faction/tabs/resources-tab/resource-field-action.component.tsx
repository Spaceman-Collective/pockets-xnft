import styled from "@emotion/styled";
import { HStack, Flex, Image, Button } from "@chakra-ui/react";
import { Tip } from "@/components/tooltip";
import { getLocalImage } from "@/lib/utils";
import { Label, Value } from "../tab.styles";
import { colors } from "@/styles/defaultTheme";
import { FC, useEffect } from "react";
import { formatRelative } from "date-fns";
import { useCountdown } from "usehooks-ts";
import { useRfHarvest } from "@/hooks/useRf";
import { useSolana } from "@/hooks/useSolana";
import { toast } from "react-hot-toast";

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
  console.log({ timer });
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
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: remainingTime > 0 ? remainingTime : 0,
      intervalMs: 1000,
    });

  useEffect(() => {
    if (!timer || remainingTime < 0) return;
    startCountdown();
  }, []);

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
          toast.success(JSON.stringify(e));
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
            borderRadius="1rem"
            alt={rf.resource}
            src={getLocalImage({
              type: "resources",
              name: rf.resource,
            })}
          />
        </Tip>
        <Label>amount:</Label>
        <Value>{rf.amount}</Value>
      </HStack>
      <HStack>
        {isFuture && <Value>{timeAgo(count)}</Value>}
        {isHarvestable && (
          <Button bg="brand.quaternary" onClick={post}>
            Harvest
          </Button>
        )}
      </HStack>
    </ResourceActionContainer>
  );
};

function timeAgo(timestamp: number): string {
  const timeDifference = Math.floor(timestamp); // Convert to seconds
  const hours = Math.floor(timeDifference / 3600);
  const minutes = Math.floor((timeDifference % 3600) / 60);
  const seconds = timeDifference % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}

function formatTime(timestamp: number): string {
  const currentTime = Date.now();
  const timeDifference = Math.floor((currentTime - timestamp) / 1000); // Convert to seconds

  const hours = Math.floor(timeDifference / 3600);
  const minutes = Math.floor((timeDifference % 3600) / 60);
  const seconds = timeDifference % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}

export const ResourceActionContainer = styled(Flex)`
  background-color: ${colors.blacks[500]};
  width: 100%;
  padding: 1.5rem;
  border-radius: 1rem;
  align-items: center;
  justify-content: space-between;
`;
