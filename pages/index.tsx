import Head from "next/head";
import dynamic from "next/dynamic";
import { NavBar } from "@/components/nav";

const ClientHome = dynamic(() => import("../components/home/client.component"));

export default function Home() {
  return (
    <>
      <Head>
        <title>Pocket.gg</title>
        <meta name="description" content="Idle-RPG with your NFTs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <ClientHome />
    </>
  );
}
