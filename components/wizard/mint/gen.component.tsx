import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { H3 } from "../wizard.styled";
import { RumbleInput } from "./rumble-input.component";
import { GenderToggleContainer } from "./gender-toggle.component";
import type { Character, NFT } from "@/types/server";
import { getRandomName } from "@/lib/utils";
import { useSolana } from "@/hooks/useSolana";
import { useCreateCharacter } from "@/hooks/useCreateCharacter";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { encode } from "bs58";

export const Generate: FC<{
  fire: () => void;
  back: () => void;
  next: () => void;
  setReviewMint: (char: Character) => void;
  nft: NFT;
}> = ({ fire: fireConfetti, back: backStep, nft, setReviewMint }) => {
  const [isMale, setIsMale] = useState(false);
  const [name, setName] = useState<string>(getRandomName({ isMale }));
  const getNewName = () => setName(getRandomName({ isMale }));

  const { mutate } = useCreateCharacter();
  const { account } = useSolana();
  const { connection } = useConnection();
  console.log(".............", connection);
  const { signTransaction } = useWallet();

  // useEffect(() => {
  //   if (isSuccess || data) {
  //     if (!data?.name) return;
  //     fireConfetti();
  //     setReviewMint(data);
  //   }
  // }, [isSuccess]);

  return (
    <>
      <Flex direction="column" justifyContent="space-between" minH="60vh">
        <H3>Generate your Character</H3>
        <GenImg img={nft.cached_image_uri} name={nft.name} />
        <Box>
          <RumbleInput name={name} shake={getNewName} />
          <GenderToggleContainer isMale={isMale} setIsMale={setIsMale} />
        </Box>
        <Flex gap="2rem">
          <Button variant="outline" w="100%" alignSelf="end" onClick={backStep}>
            Back
          </Button>
          <Button
            bg="brand.quternary"
            color="brand.primary"
            _hover={{ bg: "brand.tertiary" }}
            w="100%"
            alignSelf="end"
            onClick={async () => {
              if (!account || !signTransaction) return;
              const payload = {
                mint: nft.mint,
                timestamp: Date.now().toString(),
                name,
              };
              const blockhashcontainer = await connection.getLatestBlockhash();
              const blockhash = blockhashcontainer?.blockhash;
              console.log({ blockhashcontainer });
              const TxInstruct = new TransactionInstruction({
                keys: [
                  {
                    pubkey: new PublicKey(account),
                    isSigner: true,
                    isWritable: false,
                  },
                ],
                data: Buffer.from(JSON.stringify(payload), "utf-8"),
                programId: new PublicKey(
                  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
                ),
              });

              const txMsg = new TransactionMessage({
                payerKey: new PublicKey(account),
                recentBlockhash: blockhash,
                instructions: [TxInstruct],
              }).compileToLegacyMessage();

              const tx = new VersionedTransaction(txMsg);
              if (!tx) return;

              const signedTx = await signTransaction(tx);

              const encodedSignedTx = encode(signedTx.serialize());
              if (!signedTx) throw Error("No Tx");
              mutate(
                { signedTx: encodedSignedTx },
                {
                  onSuccess: (data) => {
                    console.log("Char minted", data);
                    setReviewMint(data);
                  },
                }
              );
            }}
          >
            Mint Charachter
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

const GenImg = ({ img, name }: { img: string; name?: string }) => {
  return (
    <Box
      m="0 auto"
      cursor="pointer"
      position="relative"
      transition="all 0.25s ease-in-out"
    >
      {name && (
        <Text
          opacity="0.7"
          position="absolute"
          top="0.5rem"
          left="0.5rem"
          bg="brand.primary"
          borderRadius="1rem"
          p="0.25rem"
          fontSize="1.25rem"
          fontWeight={700}
          letterSpacing="1px"
          zIndex={10}
        >
          {name}
        </Text>
      )}
      <Img
        width="400"
        height="1"
        alt="lad"
        src={img}
        placeholder="blur"
        blurDataURL="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
      />
    </Box>
  );
};

const Img = styled(Image)`
  border-radius: 1rem;
  object-position: end;
  object-fit: cover;
  max-height: 300px;
  width: 300px;
`;
