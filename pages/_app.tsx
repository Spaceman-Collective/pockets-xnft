import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraBaseProvider } from "@chakra-ui/react";
import { defaultTheme } from "@/styles/defaultTheme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraBaseProvider theme={defaultTheme}>
      <Component {...pageProps} />
    </ChakraBaseProvider>
  );
}
