import { ethers } from "ethers"
import * as fs from "fs-extra"
import "dotenv/config"

//REMEMBER TO SET THE PRIVATE_KEY_PASSWORD IN THE PROCESS BEFORE (EQUALS TO PASSWORD)

async function main() {
    // First, compile this!
    // And make sure to have your ganache network up!
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL!)
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8")
    let wallet = new (ethers.Wallet.fromEncryptedJsonSync as any)(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD!
    )
    wallet = await wallet.connect(provider)
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")

    const contract = await contractFactory.deploy()
    await contract.deployTransaction.wait(1)
    console.log(`Contract deployed to ${contract.address}`)

    // console.log("Here is the transaction response:");
    // console.log(contract.deployTransaction);

    const transactionReceipt = await contract.deployTransaction.wait(1)
    console.log("Here is the receipt:")
    console.log(transactionReceipt)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
