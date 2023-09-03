import Head from "next/head"
import { NavBar } from "@/components/nav"
import { Grid, Spinner } from "@chakra-ui/react"
import { useSolana } from "@/hooks/useSolana"
import { PleaseSignInContainer } from "@/components/no-wallet.component"
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Home() {
	const { push, query } = useRouter()
	useEffect(() => {
		if (typeof query?.wallet === "string") {
			push({
				pathname: "/character",
				query,
			})
		}
	}, [query?.wallet, push, query])

	return (
		<>
			<Head>
				<title>Pockets</title>
				<meta name="description" content="Idle-RPG with your NFTs" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<NavBar />
			<Grid placeItems="center" minH="50vh">
				{query?.wallet ? <Spinner /> : <PleaseSignInContainer />}
			</Grid>
		</>
	)
}
