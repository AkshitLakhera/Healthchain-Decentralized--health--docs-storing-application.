// 
export const encryptData = async (file: File) => {
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)
  
    let binary = ""
    const chunkSize = 0x8000
  
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize)
      binary += String.fromCharCode(...chunk)
    }
  
    return btoa(binary)
  }
  
  export const decryptData = (data: string) => {
    const binary = atob(data)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    return bytes
  }