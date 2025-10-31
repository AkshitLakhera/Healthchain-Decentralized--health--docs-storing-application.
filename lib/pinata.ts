// Alternative approach using Pinata SDK directly
export async function uploadToPinata(file: File): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
    const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET
  
    if (!apiKey || !apiSecret) {
      throw new Error("Missing Pinata credentials in environment variables")
    }
  
    const formData = new FormData()
    formData.append("file", file)
  
    try {
      console.log("🚀 Uploading to Pinata:", file.name)
      
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        body: formData,
        headers: {
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      })
  
      console.log("📦 Response status:", response.status)
      const responseText = await response.text()
      console.log("📦 Response body:", responseText)
  
      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.status} - ${responseText}`)
      }
  
      const data = JSON.parse(responseText)
      console.log("✅ Upload successful, CID:", data.IpfsHash)
      return data.IpfsHash // Returns the CID
    } catch (error) {
      console.error("❌ Pinata upload error:", error)
      throw error
    }
  }