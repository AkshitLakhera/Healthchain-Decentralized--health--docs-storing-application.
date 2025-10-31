import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js"
import { MEMO_PROGRAM_ID } from "@solana/spl-memo"

//  Function to store IPFS CID on Solana (using Memo program)
export async function storeReportOnSolana(wallet, patientAddress, cid, recordType) {
  try {
    //  Check if wallet is connected
    if (!wallet.publicKey) {
      throw new Error("Wallet not connected. Please connect your Solana wallet first.")
    }

    const connection = new Connection("https://api.devnet.solana.com")

    const memo = `Report: CID=${cid}|Type=${recordType}`

    //  Create Memo instruction correctly
    const memoInstruction = new TransactionInstruction({
      programId: MEMO_PROGRAM_ID,
      keys: [
        {
          pubkey: wallet.publicKey,
          isSigner: true,
          isWritable: true,
        },
      ],
      data: Buffer.from(memo, "utf8"),
    })

    const transaction = new Transaction().add(memoInstruction)

    //  Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = wallet.publicKey

    //  Send transaction
    const signature = await wallet.sendTransaction(transaction, connection)
    
    console.log("📤 Transaction sent:", signature)
    
    //  Wait for confirmation
    await connection.confirmTransaction(signature, "confirmed")

    console.log(" Stored report on Solana:", signature)
    return signature
  } catch (err) {
    console.error("Solana transaction failed:", err)
    throw err
  }
}