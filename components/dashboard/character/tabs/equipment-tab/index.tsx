// Import other components where needed, for example:
import { FC, useState } from "react"
import toast from "react-hot-toast"

import { PanelContainer } from "@/components/layout"
import { useSolana } from "@/hooks/useSolana"
import {
	useUnitConfirmEquip,
	useUnitDequip,
	useUnitRequestEquip,
} from "@/hooks/useUnit"
import { useAllWalletAssets } from "@/hooks/useWalletAssets"
import { Character, NFT } from "@/types/server"
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"
import { Transaction } from "@solana/web3.js"
import { useQueryClient } from "@tanstack/react-query"
import { CharacterEquipment } from "./CharacterEquipment"

import { Header } from "./Header"
import { Units } from "./Units"

export const EquipmentTab: FC<{ currentCharacter: Character }> = ({
	currentCharacter,
}) => {
	if (!currentCharacter) return null
	const queryClient = useQueryClient()

	const [loadingUnitEquip, setLoadingUnitEquip] = useState<boolean>(false)
	const [loadingUnitDequip, setLoadingUnitDequip] = useState<boolean>(false)

	const { mutate: requestUnitEquip } = useUnitRequestEquip()
	const { mutate: confirmUnitEquip } = useUnitConfirmEquip()
	const { mutate: dequipUnit } = useUnitDequip()

	const { data: walletAssets, isLoading: walletAssetsIsLoading } =
		useAllWalletAssets()

	const {
		signTransaction,
		walletAddress,
		buildMemoIx,
		encodeTransaction,
		connection,
	} = useSolana()

	const handleEquipUnit = async (unit: NFT) => {
		setLoadingUnitEquip(true)
		console.log("EQUIP UNIT", unit)
		const payload = {
			mint: currentCharacter.mint, // Character Mint
			unit: unit.mint, // NFT address
		}

		requestUnitEquip(payload, {
			onSuccess: async (data: { encodedTx: string }) => {
				const { encodedTx } = data

				const signedTx = await signTransaction(
					Transaction.from(bs58.decode(encodedTx)),
				)
				const encodedReturnTx = bs58.encode(signedTx.serialize())

				confirmUnitEquip(encodedReturnTx, {
					onSuccess: async () => {
						toast.success("Unit equipped")
						queryClient.refetchQueries({
							queryKey: ["wallet-assets", walletAddress],
						})
						queryClient.refetchQueries({ queryKey: ["assets"] })
						setLoadingUnitEquip(false)
					},
					onError: (e) => toast.error(JSON.stringify(e)),
					onSettled: () => setLoadingUnitEquip(false),
				})
			},
			onError: (e) => {
				toast.error(JSON.stringify(e))
				setLoadingUnitEquip(false)
			},
		})
	}

	const handleDequipUnit = async (assetId: string) => {
		const payload = { mint: currentCharacter.mint, assetId }

		const txInstructions = [
			buildMemoIx({ walletAddress: walletAddress || "", payload }),
		]

		let encodedTx
		try {
			encodedTx = await encodeTransaction({
				walletAddress,
				connection,
				signTransaction,
				txInstructions,
			})
		} catch (e) {
			encodedTx = ""
			toast.error(JSON.stringify(e))
		}

		if (!encodedTx || typeof encodedTx !== "string") {
			return toast.error("no encoded tx")
		}

		dequipUnit(encodedTx, {
			onSuccess: async () => {
				queryClient.refetchQueries({
					queryKey: ["wallet-assets", walletAddress],
				})
				toast.success("Unit dequipped")
			},
			onError: (e) => toast.error(JSON.stringify(e)),
		})

		console.log("DEQUIP UNIT", assetId)
	}
	return (
		<PanelContainer
			display="flex"
			flexDirection="column"
			gap="2rem"
			width="100%"
		>
			<Header title="Current Loadout" />
			<CharacterEquipment
				character={currentCharacter}
				handleDequipUnit={handleDequipUnit}
			/>
			<Header title="Available Units" />
			<Units
				character={currentCharacter}
				units={walletAssets?.units || []}
				handleEquipUnit={handleEquipUnit}
				loadingUnitEquip={loadingUnitEquip}
			/>
		</PanelContainer>
	)
}
