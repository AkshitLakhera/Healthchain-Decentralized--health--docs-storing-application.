let ipfsClient: any = null

export async function getIPFSClient() {
  if (!ipfsClient) {
    // Dynamic import only happens in browser
    if (typeof window !== "undefined") {
      try {
        const { create } = await import("ipfs-http-client")
        
        const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
        const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET

        if (!apiKey || !apiSecret) {
          throw new Error(
            "Missing Pinata credentials. Please set NEXT_PUBLIC_PINATA_API_KEY and NEXT_PUBLIC_PINATA_API_SECRET in your .env.local"
          )
        }

        ipfsClient = create({
          host: "gateway.pinata.cloud",
          port: 443,
          protocol: "https",
          headers: {
            "X-API-Key": apiKey,
            "X-API-Secret": apiSecret,
          },
        })
      } catch (error) {
        console.error("Failed to initialize IPFS client:", error)
        throw error
      }
    } else {
      throw new Error("IPFS client can only be initialized in the browser")
    }
  }
  return ipfsClient
}