import Head from "next/head"
import { NavBar } from "@/components/nav"
import { Grid, Spinner } from "@chakra-ui/react"
import { PleaseSignInContainer } from "@/components/no-wallet.component"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { useWallet } from "@solana/wallet-adapter-react"

export default function Home() {
	const { push } = useRouter()
	const { connecting, connected } = useWallet()

	useEffect(() => {
		if (connected) push("/character")
	}, [connected, connecting, push])

	return (
		<>
			<Head>
				<title>Pockets</title>
				<meta name="description" content="Idle-RPG with your NFTs" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<NavBar />
			<Grid placeItems="center" minH="80vh">
				<PleaseSignInContainer />
			</Grid>
		</>
	)
}
