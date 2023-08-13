import { Box, Button, Text } from "@chakra-ui/react";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";

export default function Web3Buttons() {
  const {
    web3auth,
    login,
    authIdToken,
    authenticateUser,
    signTransaction,
    getUserInfo,
  } = useWeb3Auth();

  console.log({ web3auth });
  return (
    <>
      <Box>
        {!web3auth?.connected && (
          <Button
            variant="outline"
            onClick={async () => {
              await login();
            }}
          >
            connect
          </Button>
        )}

        {!authIdToken && (
          <Button
            isDisabled={!!authIdToken}
            onClick={async () => {
              await authenticateUser();
            }}
          >
            authenticateUser
          </Button>
        )}

        <Button
          onClick={async () => {
            // await signTransaction();
            await getUserInfo();
          }}
        >
          sign
        </Button>
        <Text>{authIdToken?.idToken}</Text>
      </Box>
    </>
  );
}
