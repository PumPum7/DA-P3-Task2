import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import React from "react";
import {useWallet} from "@solana/wallet-adapter-react";
import {SplTokenDisplay} from "./SplTokenDisplay";
import NftDisplay from "./NftDisplay";

export const MainPage = () => {
	const {publicKey, sendTransaction} = useWallet();

	return (
		<main style={{
			height: "100vh",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center"
		}}>
			<h1>Doge academy - Phase 3 - Task2</h1>
			<WalletMultiButton/>
			{publicKey && <SplTokenDisplay walletAddress={publicKey?.toBase58()}/>}
			<NftDisplay />
		</main>
	)
}