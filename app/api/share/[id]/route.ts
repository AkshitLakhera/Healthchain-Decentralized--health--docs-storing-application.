import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return Response.json({ error: "Missing ID" }, { status: 400 })
  }

  const share = await prisma.shareLink.findUnique({
    where: { id },
  })

  if (!share) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }
  // console.log("NOW:", Date.now())
  // console.log("EXPIRES:", new Date(share.expiresAt).getTime())
  // console.log("DIFF (ms):", new Date(share.expiresAt).getTime() - Date.now())
  if (new Date() > new Date(share.expiresAt)) {
    return Response.json({ error: "Link expired" })
  }

  return Response.json(share)
}