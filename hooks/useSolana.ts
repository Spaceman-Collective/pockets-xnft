declare global {
	interface Window {
		xnft: any
	}
}

import { SPL_TOKENS } from "@/constants"
import { Program } from "@coral-xyz/anchor"
import {
	createAssociatedTokenAccountInstruction,
	createBurnCheckedInstruction,
	createTransferCheckedInstruction,
	getAssociatedTokenAddressSync,
} from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {
	Connection,
	PublicKey,
	SystemProgram,
	TransactionInstruction,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js"
import { encode } from "bs58"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { PocketsProgram } from "../lib/program/pockets_program"

const pocketsIDL = require("../lib/program/pockets_program.json")

export const POCKETS_PROGRAM_PROGRAMID =
	"GEUwNbnu9jkRMY8GX5Ar4R11mX9vXR8UDFnKZMn5uWLJ"

export const useSolana = () => {
	const router = useRouter()
	const [payload, setPayload] = useState<{
		connection?: any
		walletAddress?: string
		signTransaction?: any
		signAllTransactions?: any
	}>({
		connection: undefined,
		walletAddress: undefined,
		signTransaction: undefined,
		signAllTransactions: undefined,
	})

	const { connection } = useConnection()
	const { publicKey, signTransaction, signAllTransactions } = useWallet()

	useEffect(() => {
		const init = () => {
			if (window?.xnft?.solana?.isXnft) {
				const accountXnft = window.xnft.solana.publicKey?.toString()
				setPayload({
					connection: connection,
					walletAddress: accountXnft,
					signTransaction: window.xnft.solana.signTransaction,
					signAllTransactions: window.xnft.solana.signAllTransactions,
				})
			} else {
				setPayload({
					connection,
					walletAddress: publicKey?.toString(),
					signTransaction,
					signAllTransactions,
				})
			}
		}
		new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
			init()
		})
	}, [connection, publicKey, signTransaction, signAllTransactions])

	return {
		...payload,
		buildTransferIx,
		buildMemoIx,
		buildBurnIx,
		encodeTransaction,
		getBonkBalance,
		buildProspectIx,
		getRFAccount,
		sendTransaction,
		sendAllTransactions,
	}
}

const buildMemoIx = ({
	walletAddress,
	payload,
}: {
	walletAddress: string
	payload: any
}) => {
	const TxInstruct = new TransactionInstruction({
		keys: [
			{
				pubkey: new PublicKey(walletAddress),
				isSigner: true,
				isWritable: false,
			},
		],
		data: Buffer.from(JSON.stringify(payload), "utf-8"),
		programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
	})

	return TxInstruct
}

export const buildTransferIx = async ({
	walletAddress,
	connection,
	receipientAddress,
	mint,
	amount,
	decimals,
}: {
	walletAddress: string
	connection: Connection
	receipientAddress: string
	mint: string
	amount: bigint
	decimals: number
}) => {
	if (!connection) return
	if (!walletAddress) return

	let ixArray: TransactionInstruction[] = []
	const senderATA = getAssociatedTokenAddressSync(
		new PublicKey(mint),
		new PublicKey(walletAddress as string),
	)
	const receipientATA = getAssociatedTokenAddressSync(
		new PublicKey(mint),
		new PublicKey(receipientAddress),
	)

	const recipientAcc = await connection.getAccountInfo(receipientATA)
	if (recipientAcc == null) {
		ixArray.push(
			createAssociatedTokenAccountInstruction(
				new PublicKey(walletAddress),
				receipientATA,
				new PublicKey(receipientAddress),
				new PublicKey(mint),
			),
		)
	}

	ixArray.push(
		createTransferCheckedInstruction(
			senderATA,
			new PublicKey(mint),
			receipientATA,
			new PublicKey(walletAddress as string),
			amount,
			decimals,
		),
	)
	return ixArray
}

const buildBurnIx = ({
	walletAddress,
	mint,
	amount,
	decimals,
}: {
	walletAddress?: string
	mint: string
	amount: bigint
	decimals: number
}) => {
	if (!mint) {
		toast.error("No mint available!")
		return
	}
	const senderATA = getAssociatedTokenAddressSync(
		new PublicKey(mint),
		new PublicKey(walletAddress as string),
	)

	const ix = createBurnCheckedInstruction(
		senderATA,
		new PublicKey(mint),
		new PublicKey(walletAddress as string),
		amount,
		decimals,
	)
	return ix
}

const encodeTransaction = async ({
	walletAddress,
	connection,
	signTransaction,
	txInstructions,
}: {
	walletAddress?: string
	connection: Connection
	signTransaction?: any
	txInstructions?: TransactionInstruction[]
}) => {
	const { blockhash } = await connection!.getLatestBlockhash()

	const txMsg = new TransactionMessage({
		payerKey: new PublicKey(walletAddress as string),
		recentBlockhash: blockhash,
		instructions: txInstructions as TransactionInstruction[],
	}).compileToLegacyMessage()
	const tx = new VersionedTransaction(txMsg)

	try {
		if (tx.serialize().length > 1200) {
			throw new Error("Tx Too Big!")
		}
	} catch (e) {
		return Error("Tx Couldn't Serialize!")
	}

	console.info("Encoded TX: ", Buffer.from(tx.serialize()).toString("base64"))

	if (window?.xnft?.solana?.isXnft) {
		const signedTx = await window?.xnft?.solana?.signTransaction(tx)
		const encodedSignedTx = encode(signedTx.serialize())
		return encodedSignedTx
	} else {
		const signedTx = await signTransaction(tx)
		const encodedSignedTx = encode(signedTx.serialize())
		return encodedSignedTx
	}
}

export const sendTransaction = async ({
	connection,
	ixs,
	wallet,
	signTransaction,
}: {
	connection: Connection
	ixs: TransactionInstruction[]
	wallet: string
	signTransaction: any
}) => {
	if (!wallet || !ixs || !signTransaction) return
	const { blockhash } = await connection!.getLatestBlockhash()
	console.log("bh: ", blockhash)

	const txMsg = new TransactionMessage({
		payerKey: new PublicKey(wallet),
		recentBlockhash: blockhash,
		instructions: ixs,
	}).compileToLegacyMessage()

	const tx = new VersionedTransaction(txMsg)
	if (!tx) return

	console.log(
		"handleVote entx: ",
		Buffer.from(tx.serialize()).toString("base64"),
	)

	if (window?.xnft?.solana?.isXnft) {
		const signedTx = await window?.xnft?.solana?.signTransaction(tx)
		return await connection.sendRawTransaction(signedTx.serialize())
	} else {
		const signedTx = await signTransaction(tx)
		return await connection.sendRawTransaction(signedTx.serialize())
	}
}

export const sendAllTxParallel = async (
	connection: Connection,
	ixs: TransactionInstruction[],
	wallet: string,
	signAllTransactions: any,
) => {
	try {
		const maxIxsInTx = 10
		let txs = []
		for (let i = 0; i < ixs.length; i += maxIxsInTx) {
			const messageV0 = new TransactionMessage({
				payerKey: new PublicKey(wallet),
				recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
				instructions: ixs.slice(
					i,
					i + maxIxsInTx > ixs.length ? ixs.length : i + maxIxsInTx,
				),
			}).compileToLegacyMessage()
			const tx = new VersionedTransaction(messageV0)
			txs.push(tx)
		}
		signAllTransactions(txs)
			.then((sTxs: any) => {
				let sigs: Promise<string>[] = []
				for (let stx of sTxs) {
					console.log(Buffer.from(stx.serialize()).toString("base64"))
					sigs.push(connection.sendRawTransaction(stx.serialize()))
				}
				Promise.all(sigs).then((sigs: string[]) => {
					console.log(sigs)
					toast.success("Sent all transactions successfully!")
				})
			})
			.catch((e: Error) => {
				console.error(e)
				toast.error("Something went wrong sending transactions")
			})
	} catch (e) {
		throw e
	}
}

export const sendAllTransactions = async (
	connection: Connection,
	ixs: TransactionInstruction[],
	wallet: string,
	signAllTransactions: any,
) => {
	if (!wallet || !ixs || !signAllTransactions) return

	let versionedTxs: VersionedTransaction[] = []
	for (let ix of ixs) {
		const { blockhash } = await connection!.getLatestBlockhash()
		const txMsg = new TransactionMessage({
			payerKey: new PublicKey(wallet),
			recentBlockhash: blockhash,
			instructions: [ix],
		}).compileToLegacyMessage()

		const tx = new VersionedTransaction(txMsg)

		if (!tx) return

		// console.log('[sendAllTransactions] tx', Buffer.from(tx.serialize()).toString('base64'));
		versionedTxs.push(tx)

		/* sleep for 500ms to grab new blockhash */
		await new Promise((resolve) => setTimeout(resolve, 500))
	}

	const signatures: string[] = []
	if (window?.xnft?.solana?.isXnft) {
		const signedTxs =
			await window?.xnft?.solana?.signAllTransactions(versionedTxs)
		for (let signedTx of signedTxs) {
			let sig = await connection.sendRawTransaction(signedTx.serialize())
			signatures.push(sig)
		}
	} else {
		const signedTxs = await signAllTransactions(versionedTxs)
		for (let signedTx of signedTxs) {
			let sig = await connection.sendRawTransaction(signedTx.serialize())
			signatures.push(sig)
		}
	}

	return signatures
}

async function getTokenAccountBalance(
	wallet: string,
	solanaConnection: Connection,
	mint: string,
) {
	const filters: any[] = [
		{
			dataSize: 165, //size of account (bytes)
		},
		{
			memcmp: {
				offset: 32, //location of our query in the account (bytes)
				bytes: wallet, //our search criteria, a base58 encoded string
			},
		},
	]

	const accounts = await solanaConnection?.getParsedProgramAccounts(
		new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // TOKEN_PROGRAM_ID
		{ filters: filters },
	)

	// console.log(
	//   `Found ${accounts.length} token account(s) for wallet ${wallet}.`
	// );

	let retTokenBalance: number = 0
	accounts.forEach((account, i) => {
		//Parse the account data
		const parsedAccountInfo: any = account.account.data
		const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"]
		const tokenBalance: number =
			parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"]

		//Log results
		// console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
		// console.log(`--Token Mint: ${mintAddress}`);
		// console.log(`--Token Balance: ${tokenBalance}`);

		if (mintAddress === mint) {
			retTokenBalance = tokenBalance
		}
	})

	return retTokenBalance
}

const getBonkBalance = async ({
	walletAddress,
	connection,
}: {
	walletAddress: string
	connection: Connection
}) => {
	const bonkBalance = await getTokenAccountBalance(
		walletAddress,
		connection,
		SPL_TOKENS.bonk.mint,
	)

	return bonkBalance
}

const buildProspectIx = async ({
	walletAddress,
	characterMint,
	rfId,
	factionId,
}: {
	walletAddress?: string
	characterMint: string
	rfId: string
	factionId: string
}) => {
	if (!walletAddress) return

	const walletAta = getAssociatedTokenAddressSync(
		new PublicKey(characterMint),
		new PublicKey(walletAddress),
	)

	const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
		pocketsIDL,
		POCKETS_PROGRAM_PROGRAMID,
		{ connection: new Connection("https://api.mainnet-beta.solana.com") },
	)

	const ix = await POCKETS_PROGRAM.methods
		.developResourceField()
		.accounts({
			wallet: new PublicKey(walletAddress),
			walletAta,
			systemProgram: SystemProgram.programId,
			citizen: getCitizenPDA(new PublicKey(characterMint)),
			rf: getRFPDA(rfId),
			faction: getFactionPDA(factionId),
		})
		.instruction()

	return ix
}

function getCitizenPDA(characterMint: PublicKey): PublicKey {
	const [citizenPDA] = PublicKey.findProgramAddressSync(
		[Buffer.from("citizen"), Buffer.from(characterMint.toBuffer())],
		new PublicKey(POCKETS_PROGRAM_PROGRAMID),
	)
	return citizenPDA
}

function getFactionPDA(factionId: string): PublicKey {
	const [factionPDA] = PublicKey.findProgramAddressSync(
		[Buffer.from("faction"), Buffer.from(factionId)],
		new PublicKey(POCKETS_PROGRAM_PROGRAMID),
	)
	return factionPDA
}

function getRFPDA(rfId: string): PublicKey {
	const [rfPDA] = PublicKey.findProgramAddressSync(
		[Buffer.from("rf"), Buffer.from(rfId)],
		new PublicKey(POCKETS_PROGRAM_PROGRAMID),
	)
	// console.log('rfpda: ', rfPDA)
	return rfPDA
}

async function getRFAccount(connection: Connection, rfId: string) {
	const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
		pocketsIDL,
		POCKETS_PROGRAM_PROGRAMID,
		{ connection },
	)

	if (!rfId) return
	return await POCKETS_PROGRAM.account.resourceField.fetch(
		getRFPDA(rfId),
		"confirmed",
	)
}
