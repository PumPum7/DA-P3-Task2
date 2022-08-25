import {Metaplex} from "@metaplex-foundation/js";
import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";
import {useState} from "react";

const connection = new Connection(clusterApiUrl("devnet"));
const mx = Metaplex.make(connection);

export default function NftDisplay() {
	const [address, setAddress] = useState(
		"CRHpiQu8AeUC7vvDbj58vRizsv65xbRBkpaJKnVgwF2e"
	);
	const [nft, setNft] = useState<any>(null);
	const fetchNft = async () => {
		const mintAddress = new PublicKey(address)
		const nft = await mx.nfts().findByMint({mintAddress}).run();
		setNft(nft);
	};

	return (
		<section>
			<h1>NFT Mint Address</h1>
			<div>
				<input
					type="text"
					value={address}
					onChange={(event) => setAddress(event.target.value)}
					style={{
						padding: "0.5em",
						width: "fit-content"
					}}
				/>
				<button onClick={fetchNft} style={{
					all: "unset",
					backgroundColor: "#5616a8",
					padding: "0.4em",
					borderRadius: "1rem",
					margin: "0.5em",
					cursor: "pointer"
				}}>Fetch
				</button>
			</div>
			{nft && (
				<table>
					<thead>
					<tr>
						<th>Trait type</th>
						<th>Value</th>
					</tr>
					</thead>
					<tbody>
					{ /* @ts-ignore */}
					{nft.json.attributes.map(attribute => (
						<tr>
							<td>{attribute.trait_type}</td>
							<td>{attribute.value}</td>
						</tr>
					))}
					</tbody>
				</table>
			)}
		</section>
	);
}