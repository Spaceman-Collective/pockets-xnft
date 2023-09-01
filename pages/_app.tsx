import "@/styles/global.css"
import type { AppProps } from "next/app"
import { ChakraBaseProvider } from "@chakra-ui/react"
import { defaultTheme } from "@/styles/defaultTheme"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Montserrat, Roboto } from "next/font/google"
import { Layout } from "@/components/layout"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css"
import { ContextProvider } from "@/contexts/ContextProvider"
import { Toaster } from "react-hot-toast"

const queryClient = new QueryClient()
const headerFont = Roboto({ weight: ["400", "700"], subsets: ["latin"] })
const bodyFont = Montserrat({ weight: ["400", "700"], subsets: ["latin"] })

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
			<ContextProvider>
				<WalletModalProvider>
					{/* APP */}
					<QueryClientProvider client={queryClient}>
						<ChakraBaseProvider theme={defaultTheme}>
							<main className={bodyFont.className}>
								<Layout>
									<Component {...pageProps} />
								</Layout>
								<Toaster />
							</main>
						</ChakraBaseProvider>
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
					{/* APP */}
				</WalletModalProvider>
			</ContextProvider>
		</>
	)
}
