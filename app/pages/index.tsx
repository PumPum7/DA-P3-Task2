import React, {useEffect, useMemo} from 'react';
import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react';
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base';
import {PhantomWalletAdapter} from '@solana/wallet-adapter-phantom';
import {WalletModalProvider} from '@solana/wallet-adapter-react-ui';
import {clusterApiUrl} from '@solana/web3.js';

import type {NextPage} from 'next'
import {MainPage} from "../components/MainPage";


// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const Home: NextPage = () => {
	// The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
	const network = WalletAdapterNetwork.Devnet;

	// You can also provide a custom RPC endpoint.
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);

	const wallets = useMemo(
		() => [
			/**
			 * Select the wallets you wish to support, by instantiating wallet adapters here.
			 *
			 * Common adapters can be found in the npm package `@solana/wallet-adapter-wallets`.
			 * That package supports tree shaking and lazy loading -- only the wallets you import
			 * will be compiled into your application, and only the dependencies of wallets that
			 * your users connect to will be loaded.
			 */
			new PhantomWalletAdapter(),
		],
		[]
	);

	useEffect(() => {
		console.log(wallets)
	}, [wallets])

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>
					<MainPage/>
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};

export default Home;