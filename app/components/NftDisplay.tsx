import {bundlrStorage, Metaplex, walletAdapterIdentity} from "@metaplex-foundation/js";
import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";
import {useState} from "react";
import {useWallet} from "@solana/wallet-adapter-react";
import {toast} from 'react-toastify';


const connection = new Connection(clusterApiUrl("devnet"));

export default function NftDisplay() {
	const [address, setAddress] = useState(
		"CRHpiQu8AeUC7vvDbj58vRizsv65xbRBkpaJKnVgwF2e"
	);

	const wallet = useWallet()

	const metaplex = Metaplex.make(connection).use(
		walletAdapterIdentity(wallet)
	)

	metaplex.use(bundlrStorage({
		address: 'https://devnet.bundlr.network',
		providerUrl: 'https://api.devnet.solana.com',
		timeout: 60000,
	}));

	const [nft, setNft] = useState<any>(null);
	const fetchNft = async () => {
		const mintAddress = new PublicKey(address)
		try {
			const nft = await metaplex.nfts().findByMint({mintAddress}).run();
			setNft(nft);
		} catch {
			toast.error("Please make sure that the mint address is valid.");
		}
	};

	return (
		<section>
			<h2>NFT Mint Address</h2>
			<div style={{
				display: 'flex',
				flexDirection: 'row',
				paddingBottom: '10px'
			}}>
				<input
					type="text"
					placeholder="Mint address"
					value={address}
					onChange={(event) => setAddress(event.target.value)}
				/>
				<button onClick={fetchNft}>Fetch
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
						<tr key={attribute.trait_type}>
							<td>{attribute.trait_type}</td>
							<td>{attribute.value}</td>
						</tr>
					))}
					</tbody>
				</table>
			)}
			{nft && <div>
				<h2>Change NFT</h2>
				<form autoComplete="off" style={{
					display: "grid",
					gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
				}} onSubmit={async (event) => {
					event.preventDefault();
					// @ts-ignore
					const traitType = event.target.trait_type.value;
					// @ts-ignore
					const traitValue = event.target.trait_value.value;

					try {
						const {uri: newUri} = await toast.promise(
							metaplex
								.nfts()
								.uploadMetadata({
									...nft.json,
									attributes: [...nft.json.attributes, {trait_type: traitType, value: traitValue}]
								})
								.run(),
							{
								pending: "Uploading Metadata...",
								success: "Metadata successfully uploaded 👌",
								error: "Something went wrong uploading metadata"
							},
						)

						// @ts-ignore
						const {nft: updatedNft} = await toast.promise(
							metaplex
								.nfts()
								.update({
									nftOrSft: nft,
									uri: newUri
								})
								.run(),
							{
								pending: "Updating NFT...",
								success: "Updated NFT successfully 👌",
								error: "Something went wrong updating NFT"
							}
						)

						setNft(updatedNft)
						await fetchNft()
					} catch (e) {
						console.error(e)
						toast.error("Something went wrong! Please make sure that you have the update authority.")
					}

				}}>
					<input type="text" id="trait_type" name="trait_type" placeholder="Trait Type" required
								 autoComplete={"false"}/>
					<input type="text" id="trait_value" name="trait_value" placeholder="Trait Value" required/>
					<button type="submit" style={{
						gridColumn: "span 2"
					}}>Submit</button>
				</form>
			</div>}
		</section>
	);
}