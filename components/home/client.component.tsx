import { Box, Button, Text } from "@chakra-ui/react";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";

//
export default function Home() {
  return (
    <>
      {/* <Box> */}
      {/*   <Button */}
      {/*     bg={web3auth?.connected ? "green" : "red"} */}
      {/*     isDisabled={web3auth?.connected} */}
      {/*     onClick={async () => { */}
      {/*       await login(); */}
      {/*     }} */}
      {/*   > */}
      {/*     connect */}
      {/*   </Button> */}

      {/*   <Button */}
      {/*     bg={!!authIdToken ? "green" : "red"} */}
      {/*     isDisabled={!!authIdToken} */}
      {/*     onClick={async () => { */}
      {/*       await authenticateUser(); */}
      {/*     }} */}
      {/*   > */}
      {/*     authenticateUser */}
      {/*   </Button> */}

      {/*   <Button */}
      {/*     onClick={async () => { */}
      {/*       // await signTransaction(); */}
      {/*     }} */}
      {/*   > */}
      {/*     sign */}
      {/*   </Button> */}
      {/*   <Text>{authIdToken?.idToken}</Text> */}
      {/* </Box> */}
    </>
  );
}
