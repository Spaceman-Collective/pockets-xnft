import { Box, Button, Text } from "@chakra-ui/react";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";

export default function Web3Buttons() {
  const { web3auth, login, logout, authIdToken, account } = useWeb3Auth();

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

        {/* {!authIdToken && ( */}
        {/*   <Button */}
        {/*     isDisabled={!!authIdToken} */}
        {/*     onClick={async () => { */}
        {/*       await authenticateUser(); */}
        {/*     }} */}
        {/*   > */}
        {/*     authenticateUser */}
        {/*   </Button> */}
        {/* )} */}

        {account && (
          <Button
            variant="outline"
            onClick={async () => {
              await logout();
            }}
          >
            {account?.substring(0, 5)}
          </Button>
        )}
        <Text>{authIdToken?.idToken}</Text>
      </Box>
    </>
  );
}
