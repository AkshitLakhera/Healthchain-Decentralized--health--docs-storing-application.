import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.json()

  const { cid, patientWallet } = body

  const expiresAt = new Date(Date.now() +  10 * 1000)
// console.log("Prisma object:", prisma)
// console.log("Available models:", Object.keys(prisma))
// console.log("shareLink model:", prisma.shareLink)  
const share = await prisma.shareLink.create({
    data: {
      cid,
      patientWallet,
      expiresAt,
    },
  })

  return Response.json({
    url: `/shared/${share.id}`,
  })
}