import type { AppProps } from "next/app";
import { ChakraBaseProvider } from "@chakra-ui/react";
import { defaultTheme } from "@/styles/defaultTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Montserrat, Roboto } from "next/font/google";

const queryClient = new QueryClient();

const headerFont = Roboto({ weight: ["400", "700"], subsets: ["latin"] });
const bodyFont = Montserrat({ weight: ["400", "700"], subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          html {
            --header: ${headerFont.style.fontFamily};
            --body: ${bodyFont.style.fontFamily};
          }
        `}
      </style>
      <QueryClientProvider client={queryClient}>
        <ChakraBaseProvider theme={defaultTheme}>
          <Component {...pageProps} />
        </ChakraBaseProvider>
      </QueryClientProvider>
    </>
  );
}
