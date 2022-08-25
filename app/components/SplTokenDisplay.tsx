import {clusterApiUrl, Connection} from "@solana/web3.js";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {useEffect, useState} from "react";


export const SplTokenDisplay = ({walletAddress}: { walletAddress: string }) => {
	const [spltokens, setSplTokens] = useState([undefined])

	useEffect(() => {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

		connection.getParsedProgramAccounts(
			TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
			{
				filters: [
					{
						dataSize: 165, // number of bytes
					},
					{
						memcmp: {
							offset: 32, // number of bytes
							bytes: walletAddress, // base58 encoded string
						},
					},
				],
			}
		).then(accounts => {
			// @ts-ignore
			setSplTokens(accounts.map(account => account.account.data["parsed"]))
		});

	}, [])

	return (
		<section>
			<h2>SPL Tokens:</h2>
			<table>
				<thead>
				<tr>
					<th>Mint address</th>
					<th>Token Decimals</th>
				</tr>
				</thead>
				<tbody>
				{spltokens.map(
					token => {
						if (token)
							// @ts-ignore
							return <tr key={token.info.mint}>
								{ /* @ts-ignore */}
								<td>{token.info.mint}</td>
								{ /* @ts-ignore */}
								<td>{token.info.tokenAmount.decimals}</td>
							</tr>
						return <tr key="nothing">
							<td>Nothing</td>
						</tr>
					}
				)
				}
				</tbody>
			</table>
		</section>
	)

}