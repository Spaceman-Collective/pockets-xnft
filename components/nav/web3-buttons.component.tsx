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
    account,
  } = useWeb3Auth();

  console.log({ web3auth });
  return (
    <>
      <Box>
        <Button
          variant="outline"
          onClick={async () => {
            console.log("call login");
            try {
              await login();
            } catch (err) {
              console.error("XXXXXXXXXXXX");
            }
            console.log("fin login");
          }}
        >
          connect
        </Button>

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
          {account?.substring(0, 5)}
        </Button>
        <Text>{authIdToken?.idToken}</Text>
      </Box>
    </>
  );
}
