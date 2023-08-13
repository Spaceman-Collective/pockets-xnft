import { Box, Button, Text } from "@chakra-ui/react";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { useAssets } from "@/hooks/useAssets";

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

  const { refetch } = useAssets();

  return (
    <>
      <Box>
        <Button
          variant="outline"
          onClick={async () => {
            console.log("call login");
            try {
              await login();
              console.log("Login successful!");
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
            console.log(refetch());
          }}
        >
          {account?.substring(0, 5)}
        </Button>
        <Text>{authIdToken?.idToken}</Text>
      </Box>
    </>
  );
}
