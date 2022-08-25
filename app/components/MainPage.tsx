import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import React from "react";
import {useWallet} from "@solana/wallet-adapter-react";
import {SplTokenDisplay} from "./SplTokenDisplay";
import NftDisplay from "./NftDisplay";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const MainPage = () => {
	const {publicKey} = useWallet();

	return (
		<main style={{
			height: "100vh",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			padding: "20% 0"
		}}>
			<h1>Doge academy - Phase 3 - Task2</h1>
			<WalletMultiButton/>
			<div style={{
				display: "flex",
				flexDirection: "row",
				gap: "100px"
			}}>
				{publicKey && <SplTokenDisplay walletAddress={publicKey?.toBase58()}/>}
				<NftDisplay/>
			</div>
			<ToastContainer position="bottom-right" />
		</main>
	)
}